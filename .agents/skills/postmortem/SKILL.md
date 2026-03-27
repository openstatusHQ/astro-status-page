---
name: postmortem
version: 0.1.0
description: Write blameless postmortems after incidents with timeline, root cause analysis, impact assessment, and action items. Use when the user mentions "postmortem," "post-mortem," "incident review," "root cause analysis," "RCA," "incident retrospective," "what went wrong," or wants to document lessons from a resolved incident.
---

# Postmortem

Write blameless, actionable postmortems that help teams learn from incidents — not assign blame.

## When to Use

- "write a postmortem for yesterday's outage"
- "help me do an RCA for the API incident"
- "we need an incident retrospective"
- After using `incident-communication` to resolve an incident

## Workflow

### 1. Check for Context

Read `.agents/status-page-context.md` if it exists. Use it for:
- **Component names** — reference the correct service names
- **Severity levels** — classify the incident correctly
- **Past patterns** — check if this is a recurring issue
- **Tone** — match the team's communication style

If the file doesn't exist, suggest running the `status-page-context` skill first. Proceed without it if the user wants to skip.

### 2. Determine Audience

Ask the user who will read this postmortem:

| Audience | What to emphasize |
|----------|------------------|
| **Internal (engineering team)** | Deep technical detail, code-level root cause, specific system names |
| **Internal (leadership/cross-functional)** | Business impact, timeline, prevention measures, resource asks |
| **External (customers/public)** | User impact, what was done, what's changing, trust rebuilding |

Default to **internal (engineering team)** if not specified.

### 3. Gather Incident Details

Ask for or extract from conversation:

**Required (postmortem cannot proceed without these):**
- What happened (high-level summary)
- When it started and ended (UTC)
- What was affected (components, users, regions)
- What caused it (root cause, even if preliminary)
- How it was fixed (mitigation steps)

**Important (ask if not provided, mark `[TODO]` if unknown):**
- Who detected it and how (monitoring alert, customer report, internal discovery)
- Timeline of key events (detection, escalation, diagnosis, mitigation, resolution)
- Quantified impact (error rates, affected users/requests, revenue impact)
- Contributing factors beyond the root cause

**Optional (include if available):**
- On-call responders and roles
- Links to relevant logs, dashboards, PRs
- Screenshots or graphs showing the impact

### 4. Write the Postmortem

Use the template below. Fill in what you can from the information provided. Mark unknown sections with `[TODO: description of what's needed]` — never invent details.

### 5. Review Checklist

Before delivering, verify:
- [ ] Blameless language throughout (no "Person X failed to...")
- [ ] Root cause goes deep enough (at least 2 "why"s deep)
- [ ] Every action item has an owner placeholder and priority
- [ ] Timeline has at least 4 entries (detection, identification, mitigation, resolution)
- [ ] Impact is quantified where possible
- [ ] "What went well" section is not empty

## Postmortem Template

```markdown
# Postmortem: [Incident Title]

**Date:** [YYYY-MM-DD]
**Severity:** [Critical / Major / Minor]
**Duration:** [X hours Y minutes] ([start time] – [end time] UTC)
**Authors:** [TODO: who wrote this postmortem]
**Status:** Draft

---

## Summary

[2-3 sentences: what happened, what was affected, how long it lasted, and how it was resolved. Written so someone skimming only this paragraph gets the full picture.]

## Impact

- **Affected components:** [list]
- **User impact:** [what users experienced]
- **Duration:** [start] – [end] UTC ([total duration])
- **Blast radius:** [% of users/requests affected, regions, plans]
- **Data loss:** [yes/no — if yes, describe scope and recovery]
- **SLA impact:** [did this breach any SLA commitments? error budget consumed?]
- **Financial impact:** [TODO: revenue loss, credits issued, if applicable]

## Timeline

All times in UTC.

| Time | Event |
|------|-------|
| [HH:MM] | [First sign of issue — how it was detected] |
| [HH:MM] | [Escalation — who was paged, who responded] |
| [HH:MM] | [Key diagnostic step — what was investigated] |
| [HH:MM] | [Root cause identified] |
| [HH:MM] | [Mitigation applied — what was done] |
| [HH:MM] | [Recovery confirmed — metrics returned to normal] |
| [HH:MM] | [Incident declared resolved] |

## Root Cause

[Explain the root cause in plain language. Go at least 2 levels deep with "why":]

**What happened:** [the direct technical cause]

**Why it happened:** [the systemic reason the direct cause was possible]

**Why that was possible:** [the deeper process/cultural/architectural gap]

[If multiple contributing factors, list each separately.]

## Detection

- **How was it detected?** [monitoring alert / customer report / manual discovery]
- **Time to detect:** [minutes from start to first alert]
- **Was alerting effective?** [did the right alerts fire? were they actionable?]
- **Detection gap:** [what should have caught this sooner?]

## Response

- **Time to first response:** [minutes from detection to first human action]
- **Time to mitigation:** [minutes from detection to fix deployed]
- **Time to resolution:** [minutes from detection to incident closed]
- **Was the runbook followed?** [yes/no — if no, why not?]
- **Escalation path:** [who was involved, was escalation timely?]

## What Went Well

- [Thing that worked — be specific]
- [Thing that worked]
- [Thing that worked]

[This section is important. Teams that skip it only learn what to avoid, never what to repeat.]

## What Went Wrong

- [Thing that didn't work — be specific about the gap, not about people]
- [Thing that didn't work]
- [Thing that didn't work]

## Where We Got Lucky

- [Thing that could have made this worse but didn't]
- [Thing that limited the blast radius by chance, not by design]

[This section catches near-misses. If the incident had hit during peak traffic, during a deploy, or in a different region — would the impact have been worse?]

## Action Items

| Priority | Action | Owner | Due | Ticket |
|----------|--------|-------|-----|--------|
| P0 — must do | [Immediate fix to prevent exact recurrence] | [TODO] | [TODO] | [TODO] |
| P0 — must do | [Improve detection for this failure mode] | [TODO] | [TODO] | [TODO] |
| P1 — should do | [Systemic improvement to reduce risk] | [TODO] | [TODO] | [TODO] |
| P2 — nice to have | [Longer-term architectural improvement] | [TODO] | [TODO] | [TODO] |

## Lessons Learned

[1-3 key takeaways that apply beyond this specific incident. What would you tell another team to watch out for?]

---

*This postmortem will be reviewed in the next incident review meeting on [TODO: date].*
```

## Blameless Writing Guide

Postmortems exist to improve systems, not punish people. Every sentence should pass the blameless test:

| Blameful (don't write) | Blameless (write this instead) |
|----------------------|-------------------------------|
| "Engineer X forgot to check the config" | "The deployment process did not include a config validation step" |
| "The on-call engineer was slow to respond" | "The alert routed to a secondary channel with a 20-minute delay" |
| "QA missed this bug" | "The test suite did not cover this edge case" |
| "Someone deployed without testing" | "The deploy pipeline does not enforce pre-deploy test runs" |

**The rule:** Replace the person with the system. If a human made an error, the system made it possible. Fix the system.

## Root Cause Depth: The "5 Whys" Lite

A postmortem that stops at the first "why" is a bug report, not a postmortem.

**Too shallow:**
> "The API went down because a bad config was deployed."

**Deep enough:**
> "The API went down because a bad config was deployed (why?). The bad config was deployed because config changes are not validated before deploy (why?). Config validation doesn't exist because configuration is managed as raw JSON with no schema (root cause: no config schema or validation in the deploy pipeline)."

Go at least 2-3 levels deep. Stop when you reach a systemic gap that can be addressed with an action item.

## Related Skills

- `incident-communication` — Write status updates during the incident (before the postmortem)
- `status-page-context` — Set up the context document this skill reads (components, severity, past patterns)
- `maintenance` — Write planned maintenance announcements
- `status-report` — Write periodic health reports
