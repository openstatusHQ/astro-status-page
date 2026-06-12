import type {
  Maintenance,
  StatusReport,
  StatusReportUpdateType,
  StatusType,
} from "@/components/blocks/status.types";
import type {
  MaintenanceSummary,
  PageComponent,
  PageComponentGroup,
  StatusReport as SdkStatusReport,
} from "@openstatus/sdk-node";
import {
  createOpenStatusClient,
  OverallStatus,
  PageComponentType,
  StatusReportStatus,
  TimeRange,
} from "@openstatus/sdk-node";

export type PageVariant = Exclude<StatusType, "empty">;

export interface ComponentView {
  id: string;
  name: string;
  description: string;
  variant: PageVariant;
  uptime: string | null;
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

const variantPriority: Record<PageVariant, number> = {
  error: 3,
  degraded: 2,
  info: 1,
  success: 0,
};

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
  const client = createOpenStatusClient({ apiKey: options.apiKey });
  const pages = client.statusPage.v1.StatusPageService;
  const identifier = { case: "id" as const, value: options.pageId };

  const [content, overall] = await Promise.all([
    pages.getStatusPageContent({ identifier }),
    pages.getOverallStatus({ identifier }),
  ]);

  const variantByComponent = new Map(
    overall.componentStatuses.map((c) => [
      c.componentId,
      variantByStatus[c.status],
    ]),
  );

  const uptimeByComponent = new Map<string, string>();
  await Promise.all(
    content.components
      .filter((c) => c.type === PageComponentType.MONITOR)
      .map(async (c) => {
        const summary = await client.monitor.v1.MonitorService.getMonitorSummary(
          { id: c.monitorId, timeRange: TimeRange.TIME_RANGE_14D },
        );
        const total =
          summary.totalSuccessful +
          summary.totalDegraded +
          summary.totalFailed;
        if (total > 0n) {
          const ratio = Number(summary.totalSuccessful) / Number(total);
          uptimeByComponent.set(c.id, `${(ratio * 100).toFixed(2)}%`);
        }
      }),
  );

  const toView = (c: PageComponent): ComponentView => ({
    id: c.id,
    name: c.name,
    description: c.description,
    variant: variantByComponent.get(c.id) ?? "info",
    uptime: uptimeByComponent.get(c.id) ?? null,
  });

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
