---
name: status-page-context
version: 0.1.0
description: Create or update the status page context document that all other status page skills reference. Use when setting up status page skills for the first time, or when the user mentions "status page context," "configure status page," "set up incident tone," or wants to define their service components, SLAs, or communication style.
---

# Status Page Context

Create and maintain `.agents/status-page-context.md` — the foundational context document referenced by all other status page skills.

## When to Use

- First time using any status page skill
- "set up my status page context"
- "configure my incident communication style"
- "update my SLA commitments"
- User wants to define components, tone, or escalation paths

## Workflow

### 1. Check for Existing Context

Look for `.agents/status-page-context.md` in the project root.

- **If it exists**: Read it and ask the user what they want to update.
- **If it doesn't exist**: Offer two modes:
  - **Auto-draft**: Scan the codebase for clues (README, config files, status page config, package.json) and pre-fill what you can.
  - **Start from scratch**: Walk through each section interactively.

### 2. Gather Context

For each section below, ask the user to fill in or confirm. Pre-fill from codebase where possible. Do NOT skip sections — each one is used by downstream skills.

### 3. Write the File

Write the completed context to `.agents/status-page-context.md`. Use the template below.

## Context Template

```markdown
# Status Page Context

*Last updated: [date]*

## Service Overview
**Company/Product name:**
**One-liner:**
**Status page URL:**
**Primary audience:** (e.g., developers, enterprise customers, end users)

## Components
List every component shown on your status page.

| Component | Description | Criticality |
|-----------|-------------|-------------|
| | | High / Medium / Low |

## SLA & Uptime Commitments
**Uptime target:** (e.g., 99.9%, 99.95%)
**Response time SLA:** (e.g., acknowledge within 15 min, update every 30 min)
**Maintenance window:** (e.g., Tuesdays 2-4am UTC)
**SLA consequences:** (e.g., credits, contractual obligations)

## Communication Tone
**Style:** (formal / conversational / technical)
**Voice characteristics:** (e.g., calm, transparent, empathetic, no corporate jargon)
**Words to use:**
-
**Words to avoid:**
-
**Example good sentence:**
> "[example that sounds like your brand]"

## Severity Levels
| Level | Criteria | Example |
|-------|----------|---------|
| Critical | Complete service outage or data loss | API returning 500 for all requests |
| Major | Significant degradation affecting most users | Dashboard load times >10s |
| Minor | Limited impact, workaround available | Webhook delays of 2-5 minutes |
| Maintenance | Planned work, no unexpected impact | Scheduled database migration |

## Escalation & Roles
**Incident commander:** (role or person responsible for coordinating response)
**Communications lead:** (who writes/approves status updates)
**Update cadence:** (how often to post updates during an incident)
**Approval required:** (yes/no — do updates need sign-off before publishing?)

## Notification Channels
Where do status updates get published?
- [ ] Status page
- [ ] Email subscribers
- [ ] Slack/Discord
- [ ] Twitter/X
- [ ] In-app banner
- [ ] Other:

## Past Patterns
**Common incident types:**
-
**Recurring root causes:**
-
**Lessons from past incidents:**
-
```

## Guidelines

- **Be specific.** "Conversational but professional" is better than "friendly."
- **Include real examples.** A sample sentence in the right tone is worth more than a paragraph describing the tone.
- **Components matter.** Downstream skills use the component list to scope incident updates and maintenance announcements.
- **Severity levels drive behavior.** The `incident-communication` skill uses these to calibrate urgency and update frequency.
- **Keep it current.** Re-run this skill when you add components, change SLAs, or shift communication style.

## Related Skills

- `incident-communication` — Write incident updates (uses this context for tone and components)
- `postmortem` — Write blameless postmortems (uses this context for severity and past patterns)
- `maintenance` — Write maintenance announcements (uses this context for components and maintenance windows)
- `status-report` — Write periodic health reports (uses this context for components and SLA targets)
