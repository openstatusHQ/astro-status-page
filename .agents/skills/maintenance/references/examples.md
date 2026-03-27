# Maintenance — Good vs Bad Examples

Real-world examples from public status pages, analyzed for what works and what doesn't.

---

## Scheduled Announcements

### Bad: Generic boilerplate (Cloudflare datacenter pattern)

> We will be performing scheduled maintenance in ZRH (Zurich) datacenter on 2026-03-26 between 02:45 and 07:30 UTC. Traffic might be re-routed from this location, hence there is a possibility of a slight increase in latency during this maintenance window for end-users in the affected region.

**Problems:**
- Same template for every datacenter with only city/dates swapped
- "Possibility of a slight increase in latency" — vague impact
- No preparation steps for most users
- Posted 24 minutes before start — far too late

### Bad: Too sparse (Vercel pattern)

> During this scheduled system maintenance by the registry, the following services may be unavailable for .COM and .NET domains:
> - Availability Checks
> - Domain Purchases
> - Domain Renewals
> - Domain Updates

**Problems:**
- No time window duration or expected end time
- No workarounds
- No preparation instructions
- "May be unavailable" — will they or won't they?

### Good: Complete with user actions (GitHub Codespaces pattern)

> Codespaces will be undergoing global maintenance from 16:30 UTC on Wednesday, May 28 to 16:30 UTC on Thursday, May 29. Maintenance will begin in our Europe, Asia, and Australia regions. Once it is complete, maintenance will start in our US regions. Each batch of regions will take approximately three to four hours to complete.
>
> During this time period, users may experience intermittent connectivity issues when creating new Codespaces or accessing existing ones.
>
> To avoid disruptions, ensure that any uncommitted changes are committed and pushed before the maintenance starts. Codespaces with uncommitted changes will remain accessible as usual after the maintenance is complete.

**Why it works:**
- 6 days advance notice
- Regional rollout order explained
- Duration per batch specified
- Clear user impact ("intermittent connectivity issues when creating or accessing")
- Actionable preparation step ("commit and push before it starts")
- Reassurance about data safety ("uncommitted changes will remain accessible")

### Best: Leading with user action

> Save any uncommitted work in Codespaces before Wednesday 16:30 UTC — we're performing global maintenance that may interrupt active sessions for 3-4 hours per region.
>
> **When:** Wednesday May 28, 16:30 UTC – Thursday May 29, 16:30 UTC
> **Rollout order:** Europe/Asia/Australia first, then US (3-4 hours per batch)
> **What's affected:** Creating new Codespaces, accessing existing ones (intermittent connectivity)
> **What's NOT affected:** Repositories, PRs, Actions, GitHub.com
> **Prepare:** Commit and push any uncommitted changes. Existing data is safe.

**Why it's best:** Leads with the action users need to take. Structured for quick scanning. Explicitly states what's not affected.

---

## In-Progress Updates

### Bad: Boilerplate (universal pattern)

> Scheduled maintenance is currently in progress. We will provide updates as necessary.

**Problems:**
- Identical text used by GitHub, Cloudflare, and Vercel for every maintenance
- No information about progress, current state, or revised ETA
- Users have no idea if things are on track

### Good: Progress update with status

> Maintenance is underway on the database cluster. Migration of EU shards completed successfully. Now proceeding to US shards. Everything is on track for completion by 04:00 UTC.

**Why it works:**
- Shows progress (EU done, US next)
- Confirms on-track status
- Reaffirms expected end time

### Good: Flagging unexpected issues early

> Maintenance started at 02:00 UTC as scheduled. During the migration, we encountered an index rebuild that's taking longer than expected. Revising completion estimate to 05:00 UTC (originally 04:00 UTC). Live traffic is unaffected — only new deployments remain paused.

**Why it works:**
- Transparent about the delay before the original end time
- Explains why
- Confirms user impact hasn't changed

---

## Completed Announcements

### Bad: No information (universal pattern)

> The scheduled maintenance has been completed.

**Problems:**
- When did it actually finish? On time? Early? Late?
- Is everything back to normal?
- Do users need to do anything?
- Were there any issues?

### Good: Confirms normalcy with details

> Maintenance on the database cluster completed at 03:45 UTC — 15 minutes ahead of schedule. All services are operational and performing normally. No action needed from your side.

**Why it works:**
- Exact completion time
- Comparison to schedule (ahead/on time/late)
- Explicit "all services operational" confirmation
- Clear "no action needed"

### Good: Completed with follow-up needed

> Maintenance completed at 04:30 UTC (30 minutes past the originally scheduled 04:00 UTC). All services are operational. The delay was caused by an additional index rebuild that was identified during the migration.
>
> **Action needed:** If you created API keys between 02:00 and 04:30 UTC, they may need to be regenerated. All other keys are unaffected.

**Why it works:**
- Honest about the delay and why
- Specific follow-up action for affected users
- Scopes who needs to act (only users who created keys during the window)

---

## Extended Maintenance

### Bad: Silence past the end time

(No update posted. Original end time was 04:00 UTC. It's now 04:30 UTC.)

**Problems:**
- Users don't know if maintenance is still happening or if you forgot
- Trust erodes rapidly when published timelines are missed without communication

### Good: Proactive extension notice

> Update: Database maintenance is taking longer than expected due to an additional migration step we identified.
>
> **Original end time:** 04:00 UTC
> **New estimated end time:** 05:30 UTC
> **Impact remains the same:** New deployments are paused. Existing deployments and live traffic are unaffected.
>
> We'll post another update at 05:00 UTC or when complete.

**Why it works:**
- Posted before the original end time
- Explains the reason
- Confirms impact hasn't changed
- Sets next update time

---

## Cancelled Maintenance

### Bad: Vague cancellation

> The scheduled maintenance has been cancelled.

### Good: Explains why and what's next

> The database maintenance scheduled for Tuesday March 31, 02:00–04:00 UTC has been cancelled. We identified a potential issue with the migration script during pre-checks and want to resolve it before proceeding.
>
> This maintenance will be rescheduled to next week. We'll send a new announcement with the updated window.

**Why it works:**
- Names the specific maintenance (not just "the maintenance")
- Explains why it's cancelled (shows diligence, not disorganization)
- Sets expectation for rescheduling
