import * as HoverCard from "@radix-ui/react-hover-card";
import type { DailyStats } from "../utils/models";

const OPERATIONAL = 0.98;
const DEGRADED = 0.9;

function getConfigByRatio(value: number) {
  if (isNaN(value)) {
    return {
      color: "bg-gray-300/90 hover:bg-gray-300",
      label: "Missing",
    };
  }
  if (value > OPERATIONAL)
    return {
      color: "bg-green-500/90 hover:bg-green-500",
      label: "Operational",
    };
  if (value > DEGRADED)
    return {
      color: "bg-yellow-500/90 hover:bg-yellow-500",
      label: "Degraded",
    };
  return {
    color: "bg-red-500/90 hover:bg-red-500",
    label: "Downtime",
  };
}

export function Bar(props: DailyStats) {
  const ratio = props.ok / props.count;

  const date = new Intl.DateTimeFormat("en-US").format(new Date(props.day));
  const config = getConfigByRatio(ratio);

  const total = props.count;
  const failed = Math.abs(props.count - props.ok);
  const avg = props.avgLatency;

  return (
    <HoverCard.Root openDelay={100} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <div className={`${config.color} flex-1 h-10 rounded-md`} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="center"
          sideOffset={4}
          className="border rounded-md shadow-sm bg-white p-3"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {config.label}
            </p>
            <div className="flex justify-between">
              <p className="text-xs font-light text-gray-900">{date}</p>
              <p className="text-gray-600 text-xs">
                avg. <code>{avg}ms</code>
              </p>
            </div>
            <div className="my-1.5 h-px w-full bg-gray-100" />
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-gray-600">
                <code className="text-green-500">{total}</code> total requests
              </p>
              <p className="text-xs text-gray-600">
                <code className="text-red-500">{failed}</code> failed requests
              </p>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
