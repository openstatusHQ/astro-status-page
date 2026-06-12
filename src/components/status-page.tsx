import { StatusBanner } from "@/components/blocks/status-banner";
import {
  StatusComponent,
  StatusComponentDescription,
  StatusComponentHeader,
  StatusComponentHeaderLeft,
  StatusComponentHeaderRight,
  StatusComponentIcon,
  StatusComponentStatus,
  StatusComponentTitle,
  StatusComponentUptime,
} from "@/components/blocks/status-component";
import { StatusComponentGroup } from "@/components/blocks/status-component-group";
import { StatusFeed } from "@/components/blocks/status-feed";
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
import { Separator } from "@/components/ui/separator";
import type { ComponentView, StatusPageView } from "@/utils/openstatus";

function PageComponent({ component }: { component: ComponentView }) {
  return (
    <StatusComponent variant={component.variant}>
      <StatusComponentHeader>
        <StatusComponentHeaderLeft>
          <StatusComponentIcon />
          <StatusComponentTitle>{component.name}</StatusComponentTitle>
          <StatusComponentDescription>
            {component.description}
          </StatusComponentDescription>
        </StatusComponentHeaderLeft>
        <StatusComponentHeaderRight>
          {component.uptime && (
            <StatusComponentUptime>{component.uptime}</StatusComponentUptime>
          )}
          <StatusComponentStatus />
        </StatusComponentHeaderRight>
      </StatusComponentHeader>
    </StatusComponent>
  );
}

export function StatusPage({ view }: { view: StatusPageView }) {
  return (
    <StatusPageShell>
      <StatusPageHeader className="w-full border-b">
        <StatusPageHeaderContent>
          <StatusPageHeaderBrand>
            <div className="flex items-center justify-center">
              <StatusPageHeaderBrandButton>
                <a href="/">
                  <StatusPageHeaderBrandFallback title={view.title} />
                </a>
              </StatusPageHeaderBrandButton>
            </div>
          </StatusPageHeaderBrand>
        </StatusPageHeaderContent>
      </StatusPageHeader>
      <StatusPageMain>
        <div className="flex flex-col gap-6">
          <Status variant={view.status}>
            <StatusHeader>
              <StatusTitle>{view.title}</StatusTitle>
              {view.description && (
                <StatusDescription>{view.description}</StatusDescription>
              )}
            </StatusHeader>
            <StatusBanner status={view.status} />
            <StatusContent>
              {view.ungrouped.map((component) => (
                <PageComponent key={component.id} component={component} />
              ))}
              {view.groups.map((group) => (
                <StatusComponentGroup
                  key={group.id}
                  title={group.title}
                  status={group.variant}
                  defaultOpen={group.defaultOpen}
                >
                  {group.components.map((component) => (
                    <PageComponent key={component.id} component={component} />
                  ))}
                </StatusComponentGroup>
              ))}
            </StatusContent>
            <Separator className="my-6" />
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent Events</h2>
              <StatusFeed
                statusReports={view.statusReports}
                maintenances={view.maintenances}
              />
            </div>
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
