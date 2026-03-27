---
name: status-report
version: 0.1.0
description: Write periodic status reports summarizing overall system health, uptime, incidents, and maintenance. Use when the user mentions "status report," "health report," "uptime report," "weekly status," "monthly report," "system health summary," "reliability report," or wants to publish a regular update on how their services are performing.
---

# Status Report

Write periodic status reports that give stakeholders a clear picture of system health, reliability trends, and what's being done to improve.

## When to Use

- "write a weekly status report"
- "draft our monthly uptime report"
- "summarize system health for this quarter"
- "write a reliability report for stakeholders"

## Workflow

### 1. Check for Context

Read `.agents/status-page-context.md` if it exists. Use it for:
- **Component names** — report on the right services
- **SLA targets** — compare actual uptime against commitments
- **Severity levels** — classify incidents consistently
- **Tone** — match the team's communication style

If the file doesn't exist, suggest running the `status-page-context` skill first. Proceed without it if the user wants to skip.

### 2. Determine Report Type

Ask the user if not obvious:

| Type | Cadence | Audience | Focus |
|------|---------|----------|-------|
| **Weekly** | Every week | Internal team, stakeholders | Recent incidents, upcoming maintenance, quick health snapshot |
| **Monthly** | Every month | Customers, leadership | Uptime metrics, incident summary, trends, improvements |
| **Quarterly** | Every quarter | Leadership, board, customers | Reliability trends, SLA performance, strategic improvements |
| **Ad-hoc** | As needed | Varies | Specific topic (e.g., post-migration health, new region launch) |

### 3. Gather Data

Ask the user for or help them collect:

**Required:**
- Reporting period (exact date range)
- Uptime numbers per component (or overall)
- Number and severity of incidents during the period
- Any scheduled maintenance that occurred

**Important (include if available):**
- SLA target vs actual comparison
- Error budget status (consumed/remaining)
- Mean time to detect (MTTD), mean time to resolve (MTTR)
- Incident trends (improving, stable, worsening)
- Notable incidents with brief descriptions

**Optional:**
- Performance metrics (latency, throughput)
- Upcoming planned maintenance
- Reliability improvements shipped
- Customer-reported issues

### 4. Write the Report

Follow these principles:

#### Principle 1: Lead with the headline number
The first thing readers want to know: how did we do?

**Do:** "Overall uptime for March 2026: 99.97% (target: 99.9%). Zero critical incidents."
**Don't:** Start with a paragraph about the team's efforts.

#### Principle 2: Compare against targets
Raw numbers without context are meaningless. Always compare to SLA targets or previous periods.

**Do:** "API uptime: 99.95% (target: 99.9%) — 0.05% above target. Error budget: 62% remaining."
**Don't:** "API uptime: 99.95%." (Is that good? Bad? On track?)

#### Principle 3: Be honest about bad periods
A status report that only highlights good metrics loses credibility. Address misses directly.

**Do:** "Webhook delivery uptime dropped to 99.2% this month, below our 99.5% target. This was driven by the March 14 incident (see below). We've shipped [fix] to prevent recurrence."
**Don't:** Omit components that missed their targets.

#### Principle 4: Show trends, not just snapshots
One month's number doesn't tell a story. Compare to previous periods.

**Do:** "MTTR improved from 45 min (Feb) to 28 min (Mar), driven by the new automated rollback system."
**Don't:** "MTTR: 28 minutes." (Better or worse than before?)

#### Principle 5: Connect incidents to improvements
Every incident mentioned should link to what was done about it. This builds trust.

**Do:** "March 14 — Webhook delivery failure (47 min). Root cause: connection pool exhaustion. Fix shipped: automated pool scaling + alert at 80% capacity."
**Don't:** "March 14 — Webhook delivery failure (47 min)." (And then?)

#### Principle 6: End with what's next
Forward-looking items show the team is proactive, not just reactive.

**Do:** "Upcoming: Database migration (April 3, 02:00-04:00 UTC), new monitoring for edge regions, SLA review for Q2."
**Don't:** End abruptly after the metrics.

## Report Templates

### Weekly Status Report

```markdown
# Weekly Status Report: [Date Range]

## Summary
[1-2 sentences: overall health this week. Lead with the headline.]

## Uptime

| Component | Uptime | Target | Status |
|-----------|--------|--------|--------|
| [Component] | [%] | [%] | [On target / Below target] |

## Incidents This Week

| Date | Severity | Component | Duration | Summary |
|------|----------|-----------|----------|---------|
| [Date] | [Sev] | [Component] | [Duration] | [One-line summary + fix status] |

[If no incidents: "No incidents this week."]

## Maintenance

| Date | Component | Duration | Status |
|------|-----------|----------|--------|
| [Date] | [Component] | [Duration] | [Completed / Scheduled] |

## Looking Ahead
- [Upcoming maintenance]
- [Reliability improvements in progress]
- [Anything the team should be aware of]
```

### Monthly Status Report

```markdown
# Monthly Status Report: [Month Year]

## Executive Summary
[2-3 sentences: how the month went, headline metrics, key events.]

## Uptime & SLA Performance

| Component | Uptime | SLA Target | vs Target | vs Last Month |
|-----------|--------|------------|-----------|---------------|
| [Component] | [%] | [%] | [+/- %] | [+/- %] |

**Overall uptime:** [%]
**Error budget consumed:** [%] ([remaining]% remaining for [period])

## Reliability Metrics

| Metric | This Month | Last Month | Trend |
|--------|-----------|------------|-------|
| Incidents (total) | [N] | [N] | [direction] |
| Critical incidents | [N] | [N] | [direction] |
| MTTD (mean time to detect) | [min] | [min] | [direction] |
| MTTR (mean time to resolve) | [min] | [min] | [direction] |

## Incident Summary

### [Incident title] — [Date]
- **Severity:** [Level]
- **Duration:** [X min/hours]
- **Impact:** [What users experienced]
- **Root cause:** [1 sentence]
- **Fix:** [What was done]
- **Postmortem:** [Link or "published" or "in progress"]

[Repeat for each notable incident. Minor incidents can be summarized in a table.]

## Maintenance Summary

[Table of maintenance windows with component, date, duration, outcome.]

## Improvements Shipped

- [Reliability improvement with brief description of what it prevents]
- [Monitoring improvement]
- [Process improvement]

## Looking Ahead

- **Upcoming maintenance:** [Dates and components]
- **In progress:** [Reliability work underway]
- **SLA review:** [Any target changes under consideration]

---

*Next report: [Date]*
```

### Quarterly Status Report

```markdown
# Quarterly Reliability Report: [Q# Year]

## Executive Summary
[3-5 sentences: quarter performance, key wins, key challenges, strategic outlook.]

## Quarterly Metrics

| Metric | Q[N] | Q[N-1] | Q[N-2] | Trend |
|--------|------|--------|--------|-------|
| Overall uptime | [%] | [%] | [%] | [direction] |
| Critical incidents | [N] | [N] | [N] | [direction] |
| Total incident minutes | [N] | [N] | [N] | [direction] |
| MTTD | [min] | [min] | [min] | [direction] |
| MTTR | [min] | [min] | [min] | [direction] |
| Error budget remaining | [%] | [%] | [%] | [direction] |

## SLA Performance by Component

| Component | Q[N] Uptime | SLA Target | Met? |
|-----------|-------------|------------|------|
| [Component] | [%] | [%] | [Yes/No] |

## Notable Incidents

[Top 3-5 incidents by severity/impact with brief summaries and links to postmortems.]

## Reliability Investments

### Shipped This Quarter
- [Initiative]: [Impact/result]

### In Progress
- [Initiative]: [Expected completion, expected impact]

### Planned for Next Quarter
- [Initiative]: [Why, expected impact]

## Lessons Learned
- [Key takeaway from the quarter's incidents]
- [Pattern or trend identified]
- [Process or cultural insight]

## Outlook
[2-3 sentences on focus areas for next quarter.]

---

*Next quarterly report: [Date]*
```

## Anti-patterns to Avoid

| Anti-pattern | Why it's bad | Instead |
|--------------|-------------|---------|
| "All systems operational" with no data | Provides no transparency or accountability | Show uptime numbers against targets |
| Only reporting good metrics | Erodes trust when stakeholders discover omissions | Address misses directly with root cause and fix |
| Raw numbers without context | "99.95%" means nothing without the target | Always compare: vs target, vs last period |
| Listing incidents without fixes | Feels like a problem list, not a report | Connect every incident to what was done about it |
| Skipping months with no incidents | Inconsistency in reporting cadence | Still publish — "No incidents this month" is a positive signal |
| Overly long reports | Nobody reads them | Keep weekly to 1 page, monthly to 2 pages, quarterly to 3-4 pages |

## Related Skills

- `status-page-context` — Set up the context document this skill reads (components, SLA targets, tone)
- `incident-communication` — Write updates during active incidents (referenced in incident summaries)
- `postmortem` — Write detailed postmortems (linked from incident summaries)
- `maintenance` — Write maintenance announcements (referenced in maintenance summaries)
