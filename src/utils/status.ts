import type {
  StatusBarData,
  StatusType,
} from "@/components/blocks/status.types";
import type { DailyStats } from "./models";

const OPERATIONAL = 0.98;
const DEGRADED = 0.9;

export type MonitorVariant = Exclude<StatusType, "empty">;

export interface MonitorStatus {
  id: number;
  name: string;
  description: string | null;
  variant: MonitorVariant;
  uptime: string;
  data: StatusBarData[];
}

function variantFromRatio(ratio: number): MonitorVariant {
  if (ratio > OPERATIONAL) return "success";
  if (ratio > DEGRADED) return "degraded";
  return "error";
}

export function toStatusBarData(stats: DailyStats[]): StatusBarData[] {
  return stats.map(({ day, ok, count }) => {
    if (count === 0) {
      return { day, bar: [{ status: "empty", height: 100 }], card: [], events: [] };
    }
    const failed = count - ok;
    // clamp so a few failed requests stay visible
    const errorHeight = failed > 0 ? Math.max((failed / count) * 100, 10) : 0;
    return {
      day,
      bar:
        failed > 0
          ? [
              { status: "error", height: errorHeight },
              { status: "success", height: 100 - errorHeight },
            ]
          : [{ status: "success", height: 100 }],
      card: [
        { status: "success", value: `${ok} requests` },
        ...(failed > 0
          ? [{ status: "error" as const, value: `${failed} failed` }]
          : []),
      ],
      events: [],
    };
  });
}

export function toMonitorStatus(
  monitor: { id: number; name: string | null; description: string | null },
  stats: DailyStats[],
): MonitorStatus {
  const totals = stats.reduce(
    (acc, s) => ({ ok: acc.ok + s.ok, count: acc.count + s.count }),
    { ok: 0, count: 0 },
  );
  const ratio = totals.count > 0 ? totals.ok / totals.count : 1;
  // current status from the most recent day with data, not the 45-day average
  const lastDay = stats.findLast((s) => s.count > 0);
  return {
    id: monitor.id,
    name: monitor.name ?? `Monitor ${monitor.id}`,
    description: monitor.description || null,
    variant: variantFromRatio(lastDay ? lastDay.ok / lastDay.count : 1),
    uptime: `${(ratio * 100).toFixed(2)}%`,
    data: toStatusBarData(stats),
  };
}

export function overallStatus(monitors: MonitorStatus[]): MonitorVariant {
  if (monitors.some((m) => m.variant === "error")) return "error";
  if (monitors.some((m) => m.variant === "degraded")) return "degraded";
  return "success";
}
