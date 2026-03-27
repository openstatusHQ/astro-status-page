# Maintenance — Framework & Checklist

## Announcement Checklist by Phase

### Scheduled
- [ ] Specific component(s) named
- [ ] Start and end time in UTC
- [ ] Expected duration stated
- [ ] User impact described (what will/won't work)
- [ ] What's NOT affected is explicitly stated
- [ ] Preparation steps or workarounds provided (if applicable)
- [ ] Lead time is appropriate for the impact severity
- [ ] Commitment to update when maintenance starts and completes

### In-progress
- [ ] Confirms maintenance has started at [time] UTC
- [ ] States current progress (not just "in progress")
- [ ] Reaffirms or updates the expected end time
- [ ] Notes any unexpected issues or scope changes
- [ ] Confirms current user impact matches expectations

### Completed
- [ ] States actual completion time in UTC
- [ ] Notes whether it finished on time, early, or late
- [ ] Confirms all services are back to normal (or describes exceptions)
- [ ] States any follow-up user action needed (or explicitly "no action needed")
- [ ] Mentions any issues encountered during maintenance (if relevant)

### Extended
- [ ] Posted BEFORE the original end time passes
- [ ] States original and new estimated end time
- [ ] Explains reason for the extension
- [ ] Confirms whether user impact has changed
- [ ] Sets time for next update

### Cancelled
- [ ] References the specific maintenance (date, time, component)
- [ ] Explains why it's cancelled
- [ ] States whether it will be rescheduled
- [ ] Confirms no impact to current services

## Lead Time Guide

| User impact | Minimum notice | Recommended notice |
|-------------|---------------|-------------------|
| Full downtime of a critical service | 72 hours | 1 week |
| Degraded performance or partial downtime | 48 hours | 3-5 days |
| Minimal impact (latency increase, background jobs delayed) | 24 hours | 48 hours |
| No user-visible impact | 12 hours | 24 hours |

If the context file defines a standard maintenance window (e.g., "Tuesdays 02:00-04:00 UTC"), reference it — users who know the window will still appreciate the specific announcement.

## Quality Checks

### The "Should I worry?" Test
Read the scheduled announcement as a user. Within 10 seconds, can you answer:
1. Am I affected?
2. When is it happening?
3. Do I need to do anything?

If any answer is unclear, rewrite.

### The "Silence" Test
For in-progress and completed phases: does the update contain at least one piece of information beyond the phase change itself? "Maintenance is in progress" fails. "Maintenance is in progress, EU migration complete, US next, on track for 04:00 UTC" passes.

### The "Clock" Test
Check all timestamps:
- All times in UTC?
- Start AND end times included?
- Duration stated (not just start/end)?
- If regional rollout: order and per-region timing included?

### The "Preparation" Test
For scheduled announcements with user-visible impact:
- Is there a specific action users should take before maintenance?
- Is there a workaround during maintenance?
- Is there a follow-up action after maintenance?

If any of these exist but aren't mentioned, add them.

## Maintenance Communication Timeline

```
Day -7 to -3:  Post scheduled announcement (for significant maintenance)
Day -1:        Post reminder if maintenance was announced >3 days ago
Hour -1:       Post "starting in 60 minutes" reminder
Minute 0:      Post in-progress update with status
Mid-point:     Post progress update (for maintenance >2 hours)
End time:      Post completed update OR extension notice
After:         Update context file if this revealed patterns
```

## When Maintenance Becomes an Incident

If maintenance causes unexpected issues:
1. Post a maintenance update acknowledging the problem
2. Open a separate incident for the unexpected issue
3. Link the incident to the maintenance
4. Use the `incident-communication` skill for the incident updates
5. After both are resolved, decide if a `postmortem` is needed

**Trigger:** Maintenance becomes an incident when the impact exceeds what was announced, affects services that were listed as "not affected," or extends significantly beyond the planned window without a clear path to completion.

## Recurring Maintenance Patterns

If the same type of maintenance happens regularly (e.g., monthly certificate rotation, weekly database cleanup):

- **Create a template** specific to that maintenance type
- **Reference previous instances** ("similar to our March 15 maintenance")
- **Note improvements** if the process has gotten better ("this month's window is 2 hours, down from 4 hours last month thanks to [improvement]")
- **Don't copy-paste blindly** — even recurring maintenance deserves specific details for each instance
