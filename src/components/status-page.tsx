import {
  Status,
  StatusHeader,
  StatusTitle,
  StatusDescription,
  StatusContent,
} from "@/components/blocks/status-layout";
import { StatusBanner } from "@/components/blocks/status-banner";
import {
  StatusComponent,
  StatusComponentHeader,
  StatusComponentHeaderLeft,
  StatusComponentHeaderRight,
  StatusComponentTitle,
  StatusComponentDescription,
  StatusComponentIcon,
  StatusComponentUptime,
  StatusComponentStatus,
  StatusComponentBody,
  StatusComponentFooter,
} from "@/components/blocks/status-component";
import { StatusBar } from "@/components/blocks/status-bar";
import { StatusFeed } from "@/components/blocks/status-feed";
import { TooltipProvider } from "@/components/ui/tooltip";
import type {
  StatusBarData,
  StatusReport,
  StatusType,
  Maintenance,
} from "@/components/blocks/status.types";

interface MonitorData {
  id: number;
  name: string;
  description: string | null;
  variant: Exclude<StatusType, "empty">;
  uptime: string;
  barData: StatusBarData[];
}

interface StatusPageProps {
  overallStatus: StatusType;
  monitors: MonitorData[];
  statusReports: StatusReport[];
  maintenances: Maintenance[];
}

export function StatusPage({
  overallStatus,
  monitors,
  statusReports,
  maintenances,
}: StatusPageProps) {
  const variant = overallStatus === "empty" ? "success" : overallStatus;

  return (
    <TooltipProvider>
      <Status variant={variant}>
        <StatusHeader>
          <StatusTitle>Astro Status Page</StatusTitle>
          <StatusDescription>
            An open source status page by OpenStatus
          </StatusDescription>
        </StatusHeader>

        <StatusBanner status={overallStatus} />

        <StatusContent>
          {monitors.map((monitor) => (
            <StatusComponent key={monitor.id} variant={monitor.variant}>
              <StatusComponentHeader>
                <StatusComponentHeaderLeft>
                  <StatusComponentIcon />
                  <StatusComponentTitle>{monitor.name}</StatusComponentTitle>
                  {monitor.description && (
                    <StatusComponentDescription>
                      {monitor.description}
                    </StatusComponentDescription>
                  )}
                </StatusComponentHeaderLeft>
                <StatusComponentHeaderRight>
                  <StatusComponentUptime>
                    {monitor.uptime}
                  </StatusComponentUptime>
                  <StatusComponentStatus />
                </StatusComponentHeaderRight>
              </StatusComponentHeader>
              <StatusComponentBody>
                <StatusBar data={monitor.barData} />
                <StatusComponentFooter data={monitor.barData} />
              </StatusComponentBody>
            </StatusComponent>
          ))}
        </StatusContent>

        {(statusReports.length > 0 || maintenances.length > 0) && (
          <StatusFeed
            statusReports={statusReports}
            maintenances={maintenances}
          />
        )}
      </Status>
    </TooltipProvider>
  );
}
