---
name: maintenance
version: 0.1.0
description: Write planned maintenance announcements for each phase (scheduled, in-progress, completed). Use when the user mentions "maintenance announcement," "scheduled maintenance," "maintenance window," "planned downtime," "maintenance notification," or needs to communicate upcoming planned work to users.
---

# Maintenance

Write maintenance announcements that give users everything they need to prepare, stay informed, and confirm completion.

## When to Use

- "write a maintenance announcement"
- "we have database maintenance next Tuesday"
- "draft a maintenance-in-progress update"
- "announce that the maintenance is done"

## Workflow

### 1. Check for Context

Read `.agents/status-page-context.md` if it exists. Use it for:
- **Component names** — reference the correct service names
- **Maintenance window** — default schedule if one is defined
- **Tone** — match the team's communication style
- **Notification channels** — remind about where to publish

If the file doesn't exist, suggest running the `status-page-context` skill first. Proceed without it if the user wants to skip.

### 2. Determine the Phase

Ask the user which phase if not obvious:

| Phase | When | Purpose |
|-------|------|---------|
| **Scheduled** | Before the maintenance | Give users time to prepare |
| **In-progress** | Maintenance has started | Confirm it's happening, set expectations |
| **Completed** | Maintenance is done | Confirm everything is back to normal |
| **Cancelled** | Maintenance won't happen | Inform users the planned work is called off |
| **Extended** | Maintenance is running longer than planned | Update the expected end time |

### 3. Gather Details

**For scheduled announcements:**
- What components/services are affected?
- What is the maintenance window? (start time, end time, timezone — always convert to UTC)
- What will users experience? (full downtime, degraded performance, intermittent errors)
- What should users do to prepare? (save work, expect delays, switch regions)
- How far in advance is this being announced?
- Is there a workaround during the maintenance?

**For in-progress updates:**
- Is everything going as planned?
- Has the expected end time changed?
- Any unexpected impact?

**For completed announcements:**
- Did it finish on time?
- Is everything back to normal?
- Any follow-up actions needed from users?
- Were there any unexpected issues during maintenance?

### 4. Write the Announcement

Follow these principles:

#### Principle 1: Lead with what users need to do
The first sentence should tell users whether they need to take action.

**Do:** "Save any uncommitted work in Codespaces before Tuesday 16:00 UTC — we're performing scheduled maintenance that may interrupt active sessions."
**Don't:** "We will be performing scheduled maintenance on our infrastructure."

#### Principle 2: Be specific about the impact
"May experience issues" is not helpful. Tell users exactly what will and won't work.

**Do:** "During this window, new deployments will be paused. Existing deployments and live traffic will not be affected."
**Don't:** "Some services may be temporarily unavailable."

#### Principle 3: Give the full time window in UTC
Include start time, end time, and expected duration. If the maintenance rolls out regionally, explain the order.

**Do:** "Maintenance window: Tuesday March 31, 02:00–04:00 UTC (approximately 2 hours). European regions will be maintained first, followed by US regions."
**Don't:** "Maintenance will happen Tuesday night."

#### Principle 4: Announce early enough
Users need time to prepare. The lead time should match the severity of the impact:

| Impact | Minimum lead time |
|--------|------------------|
| Full downtime | 72 hours (3 days) |
| Degraded performance | 48 hours (2 days) |
| Minimal/no user impact | 24 hours |

#### Principle 5: In-progress and completed updates should add value
Most companies post "Scheduled maintenance is currently in progress" and "The scheduled maintenance has been completed" — identical boilerplate every time. Do better.

**In-progress — do:** "Maintenance is underway. Database migration is running as expected. We're approximately 30 minutes in, targeting completion by 04:00 UTC."
**In-progress — don't:** "Scheduled maintenance is currently in progress."

**Completed — do:** "Maintenance completed at 03:45 UTC, 15 minutes ahead of schedule. All services are operational. No action needed from your side."
**Completed — don't:** "The scheduled maintenance has been completed."

#### Principle 6: Communicate scope changes immediately
If maintenance takes longer than planned, post an update before the original end time.

**Do:** "Update: maintenance is taking longer than expected. New estimated completion: 05:30 UTC (originally 04:00 UTC). The delay is due to [reason]. [Impact during the extension]."
**Don't:** (silence past the original end time)

## Phase Templates

### Scheduled

```
**Scheduled Maintenance: [Component]**

[Action users should take, if any, before the maintenance starts.]

**When:** [Day, Date], [start time] – [end time] UTC (approximately [duration])
**What's affected:** [Component(s)] — [specific user impact]
**What's NOT affected:** [Unaffected services]
**What to expect:** [Describe exactly what users will experience]

[Preparation instructions or workarounds, if applicable.]

We'll post an update when maintenance begins and when it's complete.
```

### In-progress

```
**Maintenance In Progress: [Component]**

Scheduled maintenance on [Component] started at [start time] UTC.

[Current status: what's happening right now, progress if known.]
Expected completion: [end time] UTC.

[Any unexpected impact or changes from the plan. If everything is on track: "Everything is proceeding as planned."]
```

### Completed

```
**Maintenance Completed: [Component]**

Scheduled maintenance on [Component] was completed at [actual end time] UTC.

[Did it finish on time, early, or late?]
All services are operating normally.
[Any follow-up actions users need to take, e.g., "You may need to refresh your dashboard" or "No action needed."]

[If there were unexpected issues during maintenance, briefly note them and link to an incident if one was opened.]
```

### Extended

```
**Maintenance Extended: [Component]**

Scheduled maintenance on [Component] is taking longer than expected.

**Original end time:** [time] UTC
**New estimated end time:** [time] UTC
**Reason:** [Brief explanation]

[Updated user impact during the extension.]
We'll post another update at [time] UTC or when maintenance is complete.
```

### Cancelled

```
**Maintenance Cancelled: [Component]**

The scheduled maintenance for [Component] on [date, time window] UTC has been cancelled.

**Reason:** [Brief explanation]
No action is needed. All services continue to operate normally.

[If rescheduled: "This maintenance will be rescheduled to [new date]. We'll send a new announcement with details."]
```

## Anti-patterns to Avoid

| Anti-pattern | Why it's bad | Instead |
|--------------|-------------|---------|
| "We will be performing scheduled maintenance" as the opener | Buries the user action and impact | Lead with what users need to do or what they'll experience |
| Same boilerplate for every maintenance | Users stop reading maintenance notices | Include specific impact and preparation steps |
| "Some services may be temporarily unavailable" | Vague — users don't know if they're affected | Name the specific components and describe the impact |
| No update after the original end time passes | Users don't know if it's still going or if you forgot | Always post an extension notice before the end time |
| "The scheduled maintenance has been completed" (with no detail) | Missed opportunity to confirm normalcy and note any issues | State actual end time, whether everything is normal, and any user follow-up |
| Announcing maintenance 1 hour before downtime | Users can't prepare | Follow the lead time guidelines based on impact severity |
| "Thank you for your patience" | Empty filler | Replace with useful info: "No action needed" or "You may need to re-authenticate" |

## Related Skills

- `status-page-context` — Set up the context document this skill reads (components, maintenance windows, tone)
- `incident-communication` — Write updates for unplanned incidents (not scheduled maintenance)
- `status-report` — Write periodic health reports
- `postmortem` — Write postmortems (only needed if maintenance caused an unplanned incident)
