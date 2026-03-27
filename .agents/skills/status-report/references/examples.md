# Status Report — Good vs Bad Examples

---

## Executive Summary

### Bad: Vague and cheerful

> This month went well. Our systems performed reliably and we continued to improve our infrastructure. The team worked hard to maintain high availability.

**Problems:**
- No numbers
- "Went well" — by what measure?
- "Worked hard" — describes effort, not results
- Could describe any month of any company

### Good: Data-driven headline

> Overall uptime for March 2026: 99.97% (target: 99.9%). One major incident on March 14 affected webhook delivery for 47 minutes. MTTR improved to 28 minutes, down from 45 minutes in February. Error budget: 62% remaining for Q1.

**Why it works:**
- Leads with the headline number and target comparison
- Acknowledges the one miss
- Shows a positive trend (MTTR improvement)
- Error budget gives context for the quarter

---

## Uptime Table

### Bad: Numbers without context

| Component | Uptime |
|-----------|--------|
| API | 99.95% |
| Dashboard | 99.99% |
| Webhooks | 99.2% |

**Problems:**
- No targets — is 99.2% good or terrible?
- No comparison to previous period
- No indication of which components missed their targets

### Good: Full context with trends

| Component | Uptime | SLA Target | vs Target | vs Feb |
|-----------|--------|------------|-----------|--------|
| API | 99.95% | 99.9% | +0.05% | +0.02% |
| Dashboard | 99.99% | 99.9% | +0.09% | stable |
| Webhooks | 99.2% | 99.5% | **-0.3%** | -0.7% |

**Webhooks note:** Below target due to the March 14 connection pool incident (47 min outage). Fix shipped: automated pool scaling. See [postmortem link].

**Why it works:**
- Target comparison shows what "good" means
- Month-over-month trend shows direction
- Below-target component is called out with explanation and fix
- Bold formatting draws attention to the miss

---

## Incident Summary

### Bad: Incident list with no resolution

| Date | Issue |
|------|-------|
| Mar 3 | API errors |
| Mar 14 | Webhooks down |
| Mar 22 | Dashboard slow |

**Problems:**
- No severity, duration, or impact
- No root cause or fix information
- Reader doesn't know if these are resolved or recurring

### Good: Incidents connected to outcomes

### Webhook Delivery Failure — March 14
- **Severity:** Major
- **Duration:** 47 minutes (14:02–14:49 UTC)
- **Impact:** ~2,000 webhook deliveries failed; 15% of active integrations affected
- **Root cause:** Connection pool exhaustion after config change reduced pool size from 100 to 10
- **Fix:** Rolled back config; shipped automated pool scaling + alert at 80% capacity
- **Postmortem:** [Published](link)

### Dashboard Latency Spike — March 22
- **Severity:** Minor
- **Duration:** 12 minutes (09:15–09:27 UTC)
- **Impact:** Dashboard response times averaged 4s (normally <500ms); API and webhooks unaffected
- **Root cause:** Cache invalidation storm after feature deploy
- **Fix:** Added cache warming on deploy; no recurrence since
- **Postmortem:** Not required (minor severity, <15 min duration)

**Why it works:**
- Each incident tells a complete story
- Severity and duration help readers prioritize attention
- Impact is quantified
- Every incident links to a fix
- Postmortem status is tracked

---

## Improvements Section

### Bad: Vague list

- Improved monitoring
- Better alerting
- Infrastructure upgrades

**Problems:**
- What was improved? What does "better" mean?
- No connection to incidents or reliability goals
- Could be copy-pasted month after month

### Good: Specific improvements with impact

- **Automated connection pool scaling** — Prevents the class of failure that caused the March 14 webhook outage. Pool now auto-scales from 10 to 200 based on load.
- **Deploy-time cache warming** — Eliminates cache invalidation storms on feature deploys. Deployed March 23 after the dashboard latency incident. Zero recurrences since.
- **Webhook delivery retry dashboard** — New internal tool letting support see failed webhook deliveries and trigger retries. Reduces customer-reported webhook issues by giving support self-service tools.

**Why it works:**
- Each improvement is tied to a specific problem it solves
- Mentions the incident that motivated it
- States the measurable outcome or expected impact

---

## Looking Ahead Section

### Bad: Empty or generic

> We will continue to work on improving reliability.

### Good: Specific and actionable

- **Upcoming maintenance:** Database migration scheduled April 3, 02:00-04:00 UTC. New deployments will be paused; existing traffic unaffected. [Announcement link]
- **In progress:** Edge region monitoring rollout (3 of 8 regions live). Expected completion: April 15.
- **Q2 SLA review:** Evaluating whether to raise the webhook SLA target from 99.5% to 99.9% based on Q1 improvements.
- **New hire:** SRE joining the team April 7. Will own alerting and on-call improvements.

**Why it works:**
- Specific dates and milestones
- Links maintenance to its announcement
- Strategic items (SLA review) show forward thinking
- Team changes give context for capacity

---

## Report Length Guide

### Bad: 10-page weekly report

Nobody reads it. Key information is buried.

### Good: Right-sized for cadence

| Report type | Target length | Principle |
|-------------|--------------|-----------|
| Weekly | 1 page / ~300 words | Quick scan, highlight only anomalies |
| Monthly | 2 pages / ~600 words | Full metrics + incident summaries + improvements |
| Quarterly | 3-4 pages / ~1000 words | Trends + strategy + lessons learned |

**Rule of thumb:** If a section has nothing notable to report, say so in one line ("No maintenance this week") rather than filling space. A short report with all signal is better than a long report with noise.
