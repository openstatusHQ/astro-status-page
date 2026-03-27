# Status Report — Framework & Checklist

## Completeness Checklist by Report Type

### Weekly
- [ ] Date range stated
- [ ] Overall uptime headline
- [ ] Per-component uptime (if any component had issues)
- [ ] Incidents listed with severity, duration, and one-line summary
- [ ] Maintenance completed or scheduled this week
- [ ] Looking ahead section (next week's maintenance, ongoing work)
- [ ] Fits on ~1 page

### Monthly
- [ ] Date range stated
- [ ] Executive summary (2-3 sentences with headline metrics)
- [ ] Per-component uptime table with SLA targets and month-over-month comparison
- [ ] Error budget status
- [ ] Reliability metrics (MTTD, MTTR) with trends
- [ ] Incident summaries with root cause, fix, and postmortem status
- [ ] Maintenance summary
- [ ] Improvements shipped this month
- [ ] Looking ahead section
- [ ] Fits on ~2 pages

### Quarterly
- [ ] Quarter range stated
- [ ] Executive summary (3-5 sentences)
- [ ] Quarterly metrics table with 3-quarter trend
- [ ] SLA performance by component with pass/fail
- [ ] Top 3-5 incidents with summaries and postmortem links
- [ ] Reliability investments: shipped, in progress, planned
- [ ] Lessons learned from the quarter
- [ ] Outlook for next quarter
- [ ] Fits on 3-4 pages

## Quality Checks

### The "So What" Test
For every metric in the report, ask: "So what?" If you can't answer, add context.

| Fails "So What" | Passes "So What" |
|-----------------|-----------------|
| "Uptime: 99.95%" | "Uptime: 99.95% (target: 99.9%) — 0.05% above target" |
| "3 incidents this month" | "3 incidents this month (down from 5 in Feb) — no critical incidents" |
| "MTTR: 28 min" | "MTTR: 28 min (down from 45 min in Feb, driven by automated rollback)" |

### The "Missing Miss" Test
Check every component against its SLA target. If any component is below target, is it explicitly called out with:
- [ ] The gap size
- [ ] The incident(s) that caused it
- [ ] What was done to fix it
- [ ] Whether the fix is expected to prevent recurrence

A report that hides misses is worse than no report.

### The "Trend" Test
For the monthly and quarterly reports, does every key metric include comparison to the previous period? Single-point metrics don't tell a story.

- [ ] Uptime: vs last period
- [ ] Incident count: vs last period
- [ ] MTTD/MTTR: vs last period
- [ ] Error budget: remaining vs consumed

### The "Action" Test
After reading the report, can the reader answer:
1. How are we doing against our reliability goals?
2. What went wrong this period and has it been fixed?
3. What's coming next?

If any answer is "I don't know," that section needs work.

### The "Skip" Test
For each section, ask: "If I removed this section, would the reader miss important information?" If no, cut it. Reports should be signal-dense.

## Metrics Guide

### Core Metrics (include in every report)

| Metric | Definition | Why it matters |
|--------|-----------|---------------|
| **Uptime** | % of time the service was fully operational | Direct SLA measurement |
| **Incident count** | Number of incidents by severity | Volume indicator |
| **MTTD** | Mean time from incident start to detection | How fast we notice problems |
| **MTTR** | Mean time from detection to resolution | How fast we fix problems |
| **Error budget** | Remaining allowed downtime for the SLA period | Pacing indicator |

### Advanced Metrics (include when available)

| Metric | Definition | Why it matters |
|--------|-----------|---------------|
| **MTBF** | Mean time between failures | Reliability trend |
| **p50/p95/p99 latency** | Response time percentiles | Performance beyond uptime |
| **Customer-reported incidents** | Incidents first reported by customers vs monitoring | Detection coverage gap |
| **Postmortem action item completion** | % of action items completed on time | Follow-through indicator |
| **Maintenance success rate** | % of maintenance windows completed without issues | Operational maturity |

## Calculating Uptime

```
Uptime % = ((total minutes in period - downtime minutes) / total minutes in period) × 100
```

| Period | Total minutes | Allowed downtime at 99.9% | Allowed downtime at 99.95% |
|--------|--------------|--------------------------|---------------------------|
| Week | 10,080 | 10.1 min | 5.0 min |
| Month (30 days) | 43,200 | 43.2 min | 21.6 min |
| Quarter (90 days) | 129,600 | 129.6 min | 64.8 min |
| Year | 525,600 | 525.6 min (~8.8 hr) | 262.8 min (~4.4 hr) |

**Important:** Define what counts as "downtime" consistently:
- Total outage only? Or degraded performance too?
- All users, or >X% of users affected?
- Document this in `.agents/status-page-context.md`

## Report Cadence Best Practices

| Cadence | Best for | Publish day |
|---------|----------|-------------|
| Weekly | Teams with active incident response, early-stage products | Monday (covers prior week) |
| Monthly | Mature products, customer-facing reports | 1st–3rd business day of new month |
| Quarterly | Leadership, board reports, public reliability pages | 1st week of new quarter |

**Consistency matters more than frequency.** A monthly report published reliably on the 2nd of every month builds more trust than a weekly report that sometimes skips weeks.

## When to Publish Externally

Some companies publish monthly reliability reports publicly. Consider publishing externally when:
- [ ] You consistently meet or exceed SLA targets
- [ ] You have a mature postmortem process
- [ ] You want to differentiate on transparency
- [ ] Customers have asked for more visibility

External reports should be a simplified version of the internal report — focus on uptime, incidents, and improvements. Omit internal metrics like MTTD, error budget details, or team capacity.
