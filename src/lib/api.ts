import type {
  StatusBarData,
  StatusReport,
  StatusType,
  Maintenance,
} from "@/components/blocks/status.types";

// ---------------------------------------------------------------------------
// ConnectRPC v2 API client (JSON over HTTP/1.1 — works in workerd)
// ---------------------------------------------------------------------------

const API_BASE = "https://api.openstatus.dev";

async function rpc<TReq, TRes>(
  service: string,
  method: string,
  body: TReq,
  apiKey: string,
): Promise<TRes> {
  const url = `${API_BASE}/rpc/${service}/${method}`;
  const headers = {
    "Content-Type": "application/json",
    "x-openstatus-key": apiKey,
  };
  const init: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  };

  // Retry once on 5xx errors (transient)
  let res = await fetch(url, init);
  if (res.status >= 500) {
    res = await fetch(url, init);
  }

  if (!res.ok) {
    console.error(`RPC error ${res.status} for ${service}/${method}`);
    return {} as TRes;
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// v2 Response types
// ---------------------------------------------------------------------------

interface V2HTTPMonitor {
  id: string;
  name: string;
  url: string;
  description?: string;
}

interface V2ListMonitorsResponse {
  httpMonitors?: V2HTTPMonitor[];
  tcpMonitors?: Array<{ id: string; name: string }>;
  dnsMonitors?: Array<{ id: string; name: string }>;
  totalSize?: number;
}

interface V2MonitorSummary {
  id: string;
  totalSuccessful: string | number;
  totalDegraded: string | number;
  totalFailed: string | number;
  lastPingAt?: string;
}

interface V2StatusReportUpdate {
  id: string;
  status: string;
  date: string;
  message: string;
}

interface V2StatusReport {
  id: string;
  title: string;
  status: string;
  pageComponentIds?: string[];
  updates?: V2StatusReportUpdate[];
}

interface V2StatusReportSummary {
  id: string;
  title: string;
  status: string;
  pageComponentIds?: string[];
}

interface V2MaintenanceSummary {
  id: string;
  title: string;
  message: string;
  from?: string;
  to?: string;
  pageComponentIds?: string[];
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

export async function fetchMonitors(apiKey: string) {
  const data = await rpc<object, V2ListMonitorsResponse>(
    "openstatus.monitor.v1.MonitorService",
    "ListMonitors",
    {},
    apiKey,
  );
  return [
    ...(data.httpMonitors ?? []),
    ...(data.tcpMonitors ?? []),
    ...(data.dnsMonitors ?? []),
  ];
}

export async function fetchMonitorSummary(apiKey: string, monitorId: string) {
  return rpc<{ id: string; timeRange: string }, V2MonitorSummary>(
    "openstatus.monitor.v1.MonitorService",
    "GetMonitorSummary",
    { id: monitorId, timeRange: "TIME_RANGE_14D" },
    apiKey,
  );
}

/**
 * Fetch per-day summary stats via REST API v1.
 * The v2 GetMonitorSummary returns aggregated totals only,
 * but StatusBar needs daily breakdowns.
 */
export async function fetchMonitorDailySummary(
  apiKey: string,
  monitorId: string,
): Promise<ApiDailyStat[]> {
  const res = await fetch(
    `https://api.openstatus.dev/v1/monitor/${monitorId}/summary`,
    { headers: { "x-openstatus-key": apiKey } },
  );
  if (!res.ok) {
    console.error(`API error ${res.status} for monitor/${monitorId}/summary`);
    return [];
  }
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchStatusReports(apiKey: string) {
  // List summaries first
  const { statusReports: summaries } = await rpc<
    object,
    { statusReports?: V2StatusReportSummary[] }
  >(
    "openstatus.status_report.v1.StatusReportService",
    "ListStatusReports",
    {},
    apiKey,
  );

  if (!summaries?.length) return [];

  // Fetch full reports with updates
  const fullReports = await Promise.all(
    summaries.map(async (s) => {
      const { statusReport } = await rpc<
        { id: string },
        { statusReport?: V2StatusReport }
      >(
        "openstatus.status_report.v1.StatusReportService",
        "GetStatusReport",
        { id: s.id },
        apiKey,
      );
      return statusReport;
    }),
  );

  return fullReports.filter((r): r is V2StatusReport => r != null);
}

export async function fetchMaintenances(apiKey: string) {
  const { maintenances } = await rpc<
    object,
    { maintenances?: V2MaintenanceSummary[] }
  >(
    "openstatus.maintenance.v1.MaintenanceService",
    "ListMaintenances",
    {},
    apiKey,
  );
  return maintenances ?? [];
}

// ---------------------------------------------------------------------------
// Types for REST v1 daily summary (still needed for StatusBar)
// ---------------------------------------------------------------------------

interface ApiDailyStat {
  ok: number;
  count: number;
  day: string | null;
}

// ---------------------------------------------------------------------------
// Transformers
// ---------------------------------------------------------------------------

function getStatusFromRatio(ok: number, count: number): StatusType {
  if (count === 0) return "empty";
  const ratio = ok / count;
  if (ratio >= 0.99) return "success";
  if (ratio >= 0.95) return "degraded";
  return "error";
}

export function dailyStatsToBarData(stats: ApiDailyStat[]): StatusBarData[] {
  return stats.map((stat) => {
    const status = getStatusFromRatio(stat.ok, stat.count);
    const uptimePercent = stat.count > 0 ? (stat.ok / stat.count) * 100 : 0;
    const failPercent = 100 - uptimePercent;

    return {
      day: stat.day ?? "",
      bar:
        status === "success"
          ? [{ status: "success" as StatusType, height: 100 }]
          : [
              { status: "success" as StatusType, height: uptimePercent },
              { status, height: failPercent },
            ],
      card: [
        { status, value: `${uptimePercent.toFixed(2)}% uptime` },
        { status: "success" as StatusType, value: `${stat.ok} successful` },
        ...(stat.count - stat.ok > 0
          ? [{ status: "error" as StatusType, value: `${stat.count - stat.ok} failed` }]
          : []),
      ],
      events: [],
    };
  });
}

export function computeUptime(stats: ApiDailyStat[]): number {
  const totalOk = stats.reduce((sum, s) => sum + s.ok, 0);
  const totalCount = stats.reduce((sum, s) => sum + s.count, 0);
  if (totalCount === 0) return 100;
  return (totalOk / totalCount) * 100;
}

export function computeOverallStatus(stats: ApiDailyStat[]): StatusType {
  const totalOk = stats.reduce((sum, s) => sum + s.ok, 0);
  const totalCount = stats.reduce((sum, s) => sum + s.count, 0);
  return getStatusFromRatio(totalOk, totalCount);
}

const statusMap: Record<string, "investigating" | "identified" | "monitoring" | "resolved"> = {
  STATUS_REPORT_STATUS_INVESTIGATING: "investigating",
  STATUS_REPORT_STATUS_IDENTIFIED: "identified",
  STATUS_REPORT_STATUS_MONITORING: "monitoring",
  STATUS_REPORT_STATUS_RESOLVED: "resolved",
};

export function transformStatusReports(
  v2Reports: V2StatusReport[],
): StatusReport[] {
  return v2Reports.map((report) => ({
    id: Number(report.id),
    title: report.title,
    affected: report.pageComponentIds ?? [],
    updates: (report.updates ?? []).map((u) => ({
      date: u.date ? new Date(u.date) : new Date(),
      message: u.message ?? "",
      status: statusMap[u.status] ?? "investigating",
    })),
  }));
}

export function transformMaintenances(
  v2Maintenances: V2MaintenanceSummary[],
): Maintenance[] {
  return v2Maintenances.map((m) => ({
    id: Number(m.id),
    title: m.title,
    affected: m.pageComponentIds ?? [],
    message: m.message ?? "",
    from: m.from ? new Date(m.from) : new Date(),
    to: m.to ? new Date(m.to) : new Date(),
  }));
}
