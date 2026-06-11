import { StatusBanner } from "@/components/blocks/status-banner";
import { StatusBar } from "@/components/blocks/status-bar";
import {
  StatusComponent,
  StatusComponentBody,
  StatusComponentFooter,
  StatusComponentHeader,
  StatusComponentHeaderLeft,
  StatusComponentHeaderRight,
  StatusComponentStatus,
  StatusComponentTitle,
  StatusComponentUptime,
} from "@/components/blocks/status-component";
import {
  StatusPageFooter,
  StatusPageFooterContent,
  StatusPagePoweredBy,
} from "@/components/blocks/status-page-footer";
import {
  StatusPageHeader,
  StatusPageHeaderBrand,
  StatusPageHeaderBrandButton,
  StatusPageHeaderBrandFallback,
  StatusPageHeaderContent,
} from "@/components/blocks/status-page-header";
import {
  StatusPageMain,
  StatusPageShell,
} from "@/components/blocks/status-page-shell";
import {
  Status,
  StatusContent,
  StatusDescription,
  StatusHeader,
  StatusTitle,
} from "@/components/blocks/status-layout";
import type { MonitorStatus, MonitorVariant } from "@/utils/status";

const TITLE = "Astro Status Page";

export function StatusPage({
  monitors,
  status,
}: {
  monitors: MonitorStatus[];
  status: MonitorVariant;
}) {
  return (
    <StatusPageShell>
      <StatusPageHeader className="w-full border-b">
        <StatusPageHeaderContent>
          <StatusPageHeaderBrand>
            <div className="flex items-center justify-center">
              <StatusPageHeaderBrandButton>
                <a href="/">
                  <StatusPageHeaderBrandFallback title={TITLE} />
                </a>
              </StatusPageHeaderBrandButton>
            </div>
          </StatusPageHeaderBrand>
        </StatusPageHeaderContent>
      </StatusPageHeader>
      <StatusPageMain>
        <div className="flex flex-col gap-6">
          <Status variant={status}>
            <StatusHeader>
              <StatusTitle>{TITLE}</StatusTitle>
              <StatusDescription>
                An open source status page by OpenStatus
              </StatusDescription>
            </StatusHeader>
            <StatusBanner status={status} />
            <StatusContent>
              {monitors.map((monitor) => (
                <StatusComponent key={monitor.id} variant={monitor.variant}>
                  <StatusComponentHeader>
                    <StatusComponentHeaderLeft>
                      <StatusComponentTitle>
                        {monitor.name}
                      </StatusComponentTitle>
                    </StatusComponentHeaderLeft>
                    <StatusComponentHeaderRight>
                      <StatusComponentUptime>
                        {monitor.uptime}
                      </StatusComponentUptime>
                      <StatusComponentStatus />
                    </StatusComponentHeaderRight>
                  </StatusComponentHeader>
                  <StatusComponentBody>
                    <StatusBar data={monitor.data} />
                    <StatusComponentFooter data={monitor.data} />
                  </StatusComponentBody>
                </StatusComponent>
              ))}
            </StatusContent>
          </Status>
        </div>
      </StatusPageMain>
      <StatusPageFooter className="w-full border-t">
        <StatusPageFooterContent>
          <StatusPagePoweredBy>
            <a
              href="https://www.openstatus.dev"
              target="_blank"
              rel="noreferrer"
            >
              openstatus.dev
            </a>
          </StatusPagePoweredBy>
        </StatusPageFooterContent>
      </StatusPageFooter>
    </StatusPageShell>
  );
}
