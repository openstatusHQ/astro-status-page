# Postmortem — Good vs Bad Examples

---

## Summary Section

### Bad: Vague and defensive

> We experienced some issues with our API on Tuesday. The team worked hard to resolve it and everything is back to normal now.

**Problems:**
- "Some issues" — what issues?
- "Tuesday" — what time?
- "Worked hard" — describes effort, not what happened
- No mention of impact, cause, or duration

### Good: Complete picture in 3 sentences

> On March 19, 2026, between 01:05 and 02:52 UTC, the Copilot Coding Agent service was degraded. Users were unable to start new agent sessions or view existing ones, with error rates peaking at 93% of requests. The incident was caused by a system authentication issue that prevented the service from connecting to its backing datastore, and was mitigated by rotating the affected credentials.

**Why it works:**
- Exact date and time window
- Specific user impact with quantified error rates
- Root cause and fix in one sentence
- Anyone reading just this paragraph understands the full incident

---

## Timeline Section

### Bad: Too sparse

| Time | Event |
|------|-------|
| 14:00 | Issue started |
| 15:00 | Issue fixed |

**Problems:**
- Only 2 entries — no story of what happened in between
- No detection, escalation, or diagnostic steps

### Good: Tells the story of the response

| Time | Event |
|------|-------|
| 14:02 | Monitoring alert fires: API error rate >5% |
| 14:05 | On-call engineer acknowledges alert, begins investigation |
| 14:12 | Identifies elevated 503s on /v1/checks endpoint |
| 14:18 | Correlates with deployment at 13:58 — config change to connection pool |
| 14:22 | Decides to roll back deployment |
| 14:25 | Rollback initiated |
| 14:31 | Error rates return to baseline |
| 14:45 | Monitoring confirms stability, incident marked resolved |

**Why it works:**
- Shows detection → diagnosis → decision → action → confirmation
- Each entry adds information
- Timestamps show response speed (3 min to acknowledge, 16 min to identify cause)

---

## Root Cause Section

### Bad: Stops at the surface

> A bad configuration was deployed that caused the API to crash.

**Problems:**
- "Bad configuration" — what was bad about it?
- Only 1 level of "why"
- No systemic insight

### Bad: Blames a person

> An engineer deployed a configuration change without testing it in staging first, which brought down the API.

**Problems:**
- Names a human as the cause
- Suggests the fix is "tell the engineer to be more careful"
- Misses the systemic question: why was untested deployment possible?

### Good: Goes 3 levels deep, stays blameless

> **What happened:** The API connection pool size was reduced from 100 to 10 in a configuration change, causing connection exhaustion under normal load.
>
> **Why it happened:** The configuration change was applied directly to production. The staging environment uses a different config file format and was not updated, so the change was never tested under realistic load.
>
> **Why that was possible:** Configuration is managed as raw JSON files with no schema validation. There is no CI check that compares staging and production config parity, and the deploy pipeline does not enforce staging-first deployment for config changes.

**Why it works:**
- Each level reveals a deeper systemic gap
- No person is blamed — the system allowed the error
- Action items write themselves: add config schema, add parity checks, enforce staging deploys

---

## Action Items Section

### Bad: Vague with no ownership

| Action |
|--------|
| Fix the config |
| Be more careful with deployments |
| Add more monitoring |

**Problems:**
- No owner, no due date, no priority
- "Be more careful" is not an action item
- "Add more monitoring" — of what?

### Good: Specific, owned, prioritized

| Priority | Action | Owner | Due | Ticket |
|----------|--------|-------|-----|--------|
| P0 | Add JSON schema validation for API config files | [TODO: platform team] | [TODO: 1 week] | [TODO] |
| P0 | Add alerting for connection pool exhaustion (< 20% available) | [TODO: SRE] | [TODO: 1 week] | [TODO] |
| P1 | Enforce staging-first deployment for config changes in CI | [TODO: platform team] | [TODO: 2 weeks] | [TODO] |
| P2 | Audit all config files for staging/production parity | [TODO: platform team] | [TODO: 1 month] | [TODO] |

**Why it works:**
- Each action prevents a specific failure mode
- P0 items prevent exact recurrence
- P1/P2 items address systemic gaps
- Owner and due date ensure follow-through (even as TODO placeholders)

---

## "What Went Well" Section

### Bad: Empty or filler

> Everything went well in the response.

### Good: Specific and reinforcing

> - **Monitoring caught it fast.** The error rate alert fired within 2 minutes of the bad deploy. Detection time was excellent.
> - **Rollback was quick.** The team decided to roll back within 6 minutes of identifying the cause, rather than attempting a forward fix. This was the right call.
> - **Communication was timely.** The first status page update was posted within 10 minutes of detection, and updates followed every 15 minutes.

**Why it works:** Specific observations that the team can repeat. Highlights good decisions and good systems, not just good luck.

---

## "Where We Got Lucky" Section

### Bad: Omitted entirely

Most postmortems skip this section. That's a missed opportunity to catch near-misses.

### Good: Surfaces hidden risks

> - **This happened during low-traffic hours (2am UTC).** If the same deploy had gone out at peak traffic (14:00 UTC), the impact would have been ~10x worse with user-facing errors in the thousands.
> - **Only one endpoint was affected.** The config change happened to only impact the /v1/checks connection pool. If it had been applied to the shared pool, all API endpoints would have gone down.
> - **The on-call engineer had debugged a similar issue last month.** Pattern recognition sped up diagnosis. If a different engineer had been on-call, time-to-identify could have been significantly longer.

**Why it works:** Each item identifies a fragility. Action items should address these: deploy restrictions during peak hours, shared pool protections, runbook for connection issues.

---

## Blameless vs Blameful — Full Example

### Blameful version (don't write this):

> **Root cause:** John deployed the config change directly to production without going through staging. He also didn't notice the error in the connection pool value. The team should have caught this in code review but nobody reviewed the change carefully enough.

### Blameless version (write this):

> **Root cause:** A configuration change reducing the connection pool size was applied to production without passing through the staging environment. The deploy pipeline allows direct-to-production config changes, and config files lack schema validation that would catch out-of-range values. Code review for config changes does not have a required checklist for verifying staging parity.

**The difference:** The blameless version identifies three systemic gaps (pipeline allows bypass, no schema validation, no review checklist) that can each become an action item. The blameful version identifies one person who can only be told "don't do that again."
