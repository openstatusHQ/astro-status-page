import type {
  Maintenance,
  StatusBarData,
  StatusEventType,
  StatusReport,
  StatusReportImpact,
  StatusReportUpdateType,
  StatusType,
} from "@/components/blocks/status.types";
import type {
  ComponentEvent,
  MaintenanceSummary,
  PageComponent,
  PageComponentDailySummary,
  PageComponentGroup,
  StatusReport as SdkStatusReport,
} from "@openstatus/sdk-node";
import {
  ComponentDayStatus,
  ComponentEventStatus,
  ComponentEventType,
  createAuthInterceptor,
  createOpenStatusClient,
  OverallStatus,
  PageComponentImpact,
  StatusReportStatus,
} from "@openstatus/sdk-node";
import { createConnectTransport } from "@connectrpc/connect-web";

const API_URL = "https://api.openstatus.dev/rpc";

// workerd's fetch only implements redirect "follow" | "manual"; connect-web
// defaults to "error". The SDK accepts a custom transport for exactly this.
function createClient(apiKey: string) {
  return createOpenStatusClient({
    transport: createConnectTransport({
      baseUrl: API_URL,
      interceptors: [createAuthInterceptor(apiKey)],
      fetch: (input, init) =>
        globalThis.fetch(input, { ...init, redirect: "manual" }),
    }),
  });
}

export type PageVariant = Exclude<StatusType, "empty">;

export interface ComponentView {
  id: string;
  name: string;
  description: string;
  variant: PageVariant;
  uptime: string | null;
  data: StatusBarData[];
}

export interface GroupView {
  id: string;
  title: string;
  defaultOpen: boolean;
  variant: PageVariant;
  components: ComponentView[];
}

export interface StatusPageView {
  title: string;
  description: string;
  status: PageVariant;
  ungrouped: ComponentView[];
  groups: GroupView[];
  statusReports: StatusReport[];
  maintenances: Maintenance[];
}

const variantByStatus: Record<OverallStatus, PageVariant> = {
  [OverallStatus.UNSPECIFIED]: "info",
  [OverallStatus.OPERATIONAL]: "success",
  [OverallStatus.DEGRADED]: "degraded",
  [OverallStatus.PARTIAL_OUTAGE]: "error",
  [OverallStatus.MAJOR_OUTAGE]: "error",
  [OverallStatus.MAINTENANCE]: "info",
  [OverallStatus.UNKNOWN]: "info",
};

const updateTypeByStatus: Record<StatusReportStatus, StatusReportUpdateType> = {
  [StatusReportStatus.UNSPECIFIED]: "investigating",
  [StatusReportStatus.INVESTIGATING]: "investigating",
  [StatusReportStatus.IDENTIFIED]: "identified",
  [StatusReportStatus.MONITORING]: "monitoring",
  [StatusReportStatus.RESOLVED]: "resolved",
};

const impactByPageImpact: Record<PageComponentImpact, StatusReportImpact> = {
  [PageComponentImpact.UNSPECIFIED]: "operational",
  [PageComponentImpact.OPERATIONAL]: "operational",
  [PageComponentImpact.DEGRADED_PERFORMANCE]: "degraded_performance",
  [PageComponentImpact.PARTIAL_OUTAGE]: "partial_outage",
  [PageComponentImpact.MAJOR_OUTAGE]: "major_outage",
};

const barStatusByDayStatus: Record<ComponentDayStatus, StatusType> = {
  [ComponentDayStatus.UNSPECIFIED]: "empty",
  [ComponentDayStatus.OPERATIONAL]: "success",
  [ComponentDayStatus.DEGRADED]: "degraded",
  [ComponentDayStatus.DOWN]: "error",
  [ComponentDayStatus.MAINTENANCE]: "info",
  [ComponentDayStatus.EMPTY]: "empty",
};

const eventTypeByType: Record<ComponentEventType, StatusEventType> = {
  [ComponentEventType.UNSPECIFIED]: "incident",
  [ComponentEventType.MAINTENANCE]: "maintenance",
  [ComponentEventType.INCIDENT]: "incident",
  [ComponentEventType.REPORT]: "report",
};

const eventStatusOverride: Record<ComponentEventStatus, PageVariant | undefined> =
  {
    [ComponentEventStatus.UNSPECIFIED]: undefined,
    [ComponentEventStatus.OPERATIONAL]: "success",
    [ComponentEventStatus.DEGRADED]: "degraded",
    [ComponentEventStatus.DOWN]: "error",
    [ComponentEventStatus.MAINTENANCE]: "info",
  };

const variantPriority: Record<PageVariant, number> = {
  error: 3,
  degraded: 2,
  info: 1,
  success: 0,
};

function uptimeFromBuckets(summary: PageComponentDailySummary): string | null {
  let ok = 0n;
  let count = 0n;
  for (const b of summary.buckets) {
    ok += b.ok;
    count += b.count;
  }
  if (count === 0n) return null;
  return `${((Number(ok) / Number(count)) * 100).toFixed(2)}%`;
}

function toStatusBarData(summary: PageComponentDailySummary): StatusBarData[] {
  const eventsByDay = new Map<string, ComponentEvent[]>();
  for (const ev of summary.events) {
    const key = ev.from.slice(0, 10);
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev]);
  }
  return summary.buckets.map((b): StatusBarData => {
    const impact =
      b.impact !== undefined ? impactByPageImpact[b.impact] : undefined;
    const card: StatusBarData["card"] = [];
    if (b.ok > 0n) card.push({ status: "success", value: String(b.ok) });
    if (b.degraded > 0n)
      card.push({ status: "degraded", value: String(b.degraded), impact });
    if (b.error > 0n)
      card.push({ status: "error", value: String(b.error), impact });
    return {
      day: b.day,
      bar: [{ status: barStatusByDayStatus[b.status], height: 100 }],
      card,
      events: (eventsByDay.get(b.day.slice(0, 10)) ?? []).map((ev) => ({
        id: ev.id,
        name: ev.name,
        type: eventTypeByType[ev.type],
        from: new Date(ev.from),
        to: ev.to ? new Date(ev.to) : null,
        status: eventStatusOverride[ev.status],
      })),
    };
  });
}

function worstVariant(variants: PageVariant[]): PageVariant {
  return variants.reduce(
    (worst, v) => (variantPriority[v] > variantPriority[worst] ? v : worst),
    "success",
  );
}

function toStatusReport(
  report: SdkStatusReport,
  componentNames: Map<string, string>,
): StatusReport {
  return {
    id: Number(report.id),
    title: report.title,
    affected: report.pageComponentIds.map(
      (id) => componentNames.get(id) ?? id,
    ),
    updates: report.updates.map((update) => ({
      date: new Date(update.date),
      message: update.message,
      status: updateTypeByStatus[update.status],
      impactChanges: update.componentImpacts.map((c) => ({
        name: componentNames.get(c.pageComponentId) ?? c.pageComponentId,
        impact: impactByPageImpact[c.impact],
      })),
    })),
  };
}

function toMaintenance(
  maintenance: MaintenanceSummary,
  componentNames: Map<string, string>,
): Maintenance {
  return {
    id: Number(maintenance.id),
    title: maintenance.title,
    affected: maintenance.pageComponentIds.map(
      (id) => componentNames.get(id) ?? id,
    ),
    message: maintenance.message,
    from: new Date(maintenance.from),
    to: new Date(maintenance.to),
  };
}

export async function loadStatusPage(options: {
  apiKey: string;
  pageId: string;
}): Promise<StatusPageView> {
  const client = createClient(options.apiKey);
  const pages = client.statusPage.v1.StatusPageService;
  const identifier = { case: "id" as const, value: options.pageId };

  const [content, overall, daily] = await Promise.all([
    pages.getStatusPageContent({ identifier }),
    pages.getOverallStatus({ identifier }),
    pages.getPageComponentDailySummary({ identifier, days: 45 }),
  ]);

  const variantByComponent = new Map(
    overall.componentStatuses.map((c) => [
      c.componentId,
      variantByStatus[c.status],
    ]),
  );

  const dailyByComponent = new Map(
    daily.components.map((c) => [c.componentId, c]),
  );

  const toView = (c: PageComponent): ComponentView => {
    const summary = dailyByComponent.get(c.id);
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      variant: variantByComponent.get(c.id) ?? "info",
      uptime: summary ? uptimeFromBuckets(summary) : null,
      data: summary ? toStatusBarData(summary) : [],
    };
  };

  const byOrder = (a: PageComponent, b: PageComponent) => a.order - b.order;
  const ungrouped = content.components
    .filter((c) => !c.groupId)
    .sort(byOrder)
    .map(toView);

  const groups = content.groups.map((group: PageComponentGroup): GroupView => {
    const members = content.components
      .filter((c) => c.groupId === group.id)
      .sort((a, b) => a.groupOrder - b.groupOrder)
      .map(toView);
    return {
      id: group.id,
      title: group.name,
      defaultOpen: group.defaultOpen,
      variant: worstVariant(members.map((m) => m.variant)),
      components: members,
    };
  });

  const componentNames = new Map(
    content.components.map((c) => [c.id, c.name]),
  );

  return {
    title: content.statusPage?.title ?? "Status Page",
    description: content.statusPage?.description ?? "",
    status: variantByStatus[overall.overallStatus],
    ungrouped,
    groups,
    statusReports: content.statusReports.map((r) =>
      toStatusReport(r, componentNames),
    ),
    maintenances: content.maintenances.map((m) =>
      toMaintenance(m, componentNames),
    ),
  };
}
