---
name: incident-communication
version: 0.1.0
description: Write clear, empathetic incident status updates for any phase of an incident (investigating, identified, monitoring, resolved). Use when the user mentions "incident update," "status update," "outage communication," "write an incident," "investigating update," "post-incident update," or needs to communicate a service disruption to users.
---

# Incident Communication

Write status page updates that are clear, honest, and useful — for any phase of an incident.

## When to Use

- "write an incident update"
- "we have an API outage, help me communicate it"
- "draft a resolved update for the database incident"
- "our webhooks are delayed, what should I post?"

## Workflow

### 1. Check for Context

Read `.agents/status-page-context.md` if it exists. Use it for:
- **Tone and voice** — match the team's communication style
- **Components** — reference the correct component names
- **Severity levels** — calibrate urgency appropriately
- **Update cadence** — respect the team's SLA for update frequency

If the file doesn't exist, suggest running the `status-page-context` skill first. Proceed without it if the user wants to skip.

### 2. Determine the Phase

Ask the user which phase they're in if not obvious from their message:

| Phase | When | Purpose |
|-------|------|---------|
| **Investigating** | Something is wrong, cause unknown | Acknowledge the issue, set expectations |
| **Identified** | Root cause found, fix in progress | Explain what's happening, share the plan |
| **Monitoring** | Fix deployed, watching for stability | Confirm the fix, set recovery expectations |
| **Resolved** | Incident is over | Summarize what happened with exact timeframes |

### 3. Gather Incident Details

For any phase, you need:
- **What's affected** — which components/services (use names from context if available)
- **What's the user impact** — what are users experiencing? (errors, slowness, data loss)
- **What's NOT affected** — critical for reducing panic
- **What's being done** — current actions being taken

Additional details by phase:
- **Investigating:** When did it start? Who reported it?
- **Identified:** What's the root cause? What's the fix plan? ETA?
- **Monitoring:** What fix was deployed? How long will monitoring last?
- **Resolved:** Exact start/end times (UTC). What was the root cause? Will there be a postmortem?

### 4. Write the Update

Follow these principles (in priority order):

#### Principle 1: Scope the blast radius immediately
The first sentence should tell users what's affected AND what's not.

**Do:** "REST API requests are returning elevated 5xx errors. The dashboard and webhook delivery are operating normally."
**Don't:** "We are investigating reports of degraded performance for some services."

#### Principle 2: Be specific about user impact
Describe what users are experiencing, not just what's broken internally.

**Do:** "Deployments created between 11:20 and 15:14 UTC may be failing. Existing deployments are unaffected."
**Don't:** "We are experiencing an issue with our deployment pipeline."

#### Principle 3: Give actionable guidance when possible
If users can do something to mitigate, tell them.

**Do:** "If you're seeing errors, redeploying will resolve the issue for your project."
**Don't:** "We are working on a fix."

#### Principle 4: Include timestamps in UTC
Every update should reference when things happened.

**Do:** "Starting at 14:25 UTC, iDEAL transactions began failing."
**Don't:** "We recently noticed some issues."

#### Principle 5: Set expectations for the next update
Tell users when they'll hear from you again.

**Do:** "We'll post another update within 30 minutes or sooner if the situation changes."
**Don't:** (silence)

#### Principle 6: Resolved updates summarize the full story
Include exact time window, what happened, what was done, and whether a postmortem will follow.

**Do:** "Between 18:00 and 18:23 UTC, the REST API experienced elevated error rates (peak 12% of requests) caused by a misconfigured load balancer rule. The rule was rolled back at 18:19 UTC and error rates returned to normal by 18:23 UTC. We'll publish a full postmortem within 48 hours."
**Don't:** "This incident has been resolved."

### 5. What to Communicate Next

After writing the update, always tell the user what comes next:
- **After investigating:** "When you identify the cause, run this skill again for an 'identified' update."
- **After identified:** "Once the fix is deployed, run this skill for a 'monitoring' update."
- **After monitoring:** "When you're confident the fix is stable, run this skill for a 'resolved' update."
- **After resolved:** "Consider writing a postmortem — use the `postmortem` skill."

## Phase Templates

### Investigating

```
[Component] is experiencing [user-visible impact] starting at [time UTC].
[What is NOT affected].
We are investigating the cause and will provide an update by [time/timeframe].
```

### Identified

```
We've identified the cause of [brief description of issue affecting Component].
[Root cause in plain language].
We are [action being taken] and expect [recovery ETA or "will update when we have an ETA"].
[What users can do in the meantime, if anything].
Next update by [time/timeframe].
```

### Monitoring

```
A fix for [brief issue description] has been deployed at [time UTC].
[What the fix was, in one sentence].
We are monitoring for stability and will resolve this incident if no further issues arise within [timeframe].
[Any user action needed, e.g., "no action needed" or "you may need to retry failed requests"].
```

### Resolved

```
Between [start time] and [end time] UTC, [Component] experienced [user-visible impact].
[Root cause in 1-2 sentences].
[What was done to fix it].
[Impact summary: % of users/requests affected, if known].
[Postmortem commitment: "We'll publish a detailed postmortem within [timeframe]" or "No further action needed"].
```

## Anti-patterns to Avoid

| Anti-pattern | Why it's bad | Instead |
|--------------|-------------|---------|
| "We apologize for any inconvenience" | Empty corporate filler | State impact honestly and what you're doing |
| "Some users may experience issues" | Vague, unhelpful | Specify what users see and who's affected |
| "We are continuing to investigate" (repeated) | No new information | Share what you've learned, even if partial |
| "This incident has been resolved" (with no details) | Users don't know what happened | Summarize timeline, cause, fix, and impact |
| "Please be patient" | Patronizing | Give an ETA or next update time |
| Copy-pasting the same update multiple times | Looks lazy, erodes trust | Each update should add new information |

## Related Skills

- `status-page-context` — Set up the context document this skill reads (tone, components, severity)
- `postmortem` — Write a detailed postmortem after a resolved incident
- `maintenance` — Write planned maintenance announcements (not incidents)
- `status-report` — Write periodic health reports
