# Postmortem — Framework & Checklist

## Completeness Checklist

### Structure
- [ ] Has a clear, descriptive title (not "Incident on [date]")
- [ ] Severity is classified
- [ ] Duration is stated with exact UTC timestamps
- [ ] Status is marked (Draft / Reviewed / Final)

### Summary
- [ ] Readable in under 30 seconds
- [ ] Covers: what happened, what was affected, how long, how it was fixed
- [ ] Someone reading only the summary understands the incident

### Impact
- [ ] Affected components are named
- [ ] User impact is described (what users experienced)
- [ ] Blast radius is quantified (% of users, requests, or regions)
- [ ] SLA impact is assessed
- [ ] Data loss is explicitly stated (even if "none")

### Timeline
- [ ] At least 6 entries covering: detection → escalation → diagnosis → identification → mitigation → resolution
- [ ] All times in UTC
- [ ] Shows how the incident was detected (alert, customer report, manual)
- [ ] Shows key decision points (e.g., "decided to roll back vs forward-fix")

### Root Cause
- [ ] Goes at least 2 levels deep ("why" → "why was that possible")
- [ ] Reaches a systemic gap, not a human error
- [ ] Uses blameless language throughout
- [ ] Contributing factors are listed separately from the primary cause

### Detection & Response
- [ ] Time-to-detect is documented
- [ ] Time-to-mitigate is documented
- [ ] Alerting effectiveness is assessed
- [ ] Escalation path is documented

### What Went Well
- [ ] At least 2 specific items
- [ ] Items are actionable insights (things to repeat), not filler

### What Went Wrong
- [ ] At least 2 specific items
- [ ] Items describe systemic gaps, not personal failures
- [ ] Each item maps to at least one action item

### Where We Got Lucky
- [ ] At least 1 item identifying a near-miss or hidden fragility
- [ ] Items suggest what could have made it worse

### Action Items
- [ ] At least 1 P0 item preventing exact recurrence
- [ ] At least 1 item improving detection
- [ ] Every item has an owner (or TODO placeholder)
- [ ] Every item has a priority (P0/P1/P2)
- [ ] Every item has a due date (or TODO placeholder)
- [ ] No action item is "be more careful" or "try harder"

### Lessons Learned
- [ ] 1-3 takeaways that generalize beyond this incident
- [ ] Useful to a team that wasn't involved in this incident

## Quality Checks

### The Blameless Test
Read every sentence. Replace any person-as-cause with a system-as-cause:
- "Engineer X did Y" → "The system allowed Y without [safeguard]"
- "Team didn't catch" → "The process lacked [check]"
- "Should have known" → "No documentation/runbook existed for"

### The "So What" Test
For each action item, ask: "If we do this, does it prevent this incident or a similar one?" If the answer is "not really" or "maybe," the action item is too vague.

| Fails "So What" test | Passes "So What" test |
|---------------------|----------------------|
| "Improve monitoring" | "Add alert for connection pool utilization < 20%" |
| "Review deploy process" | "Add CI gate requiring staging deploy before production for config changes" |
| "Better communication" | "Add auto-notification to #incidents Slack channel when error rate alert fires" |

### The Recurrence Test
Cover the action items section and ask: "Could this exact incident happen again tomorrow?" If yes, the postmortem hasn't identified the right fixes.

### The Depth Test
Read the root cause section. Count the "why" levels:
- **1 level:** This is a bug report, not a postmortem. Go deeper.
- **2 levels:** Minimum acceptable. You've found a systemic gap.
- **3 levels:** Good. You've likely found a process or architectural issue.
- **4+ levels:** You may be going too deep. Stop when you reach something actionable.

### The Newcomer Test
Give the postmortem to someone not involved in the incident. Can they:
1. Understand what happened in under 2 minutes?
2. Understand why it happened?
3. Understand what's being done to prevent it?

If any answer is no, revise that section.

## Severity Classification Guide

| Severity | Criteria | Postmortem depth |
|----------|----------|-----------------|
| **Critical** | Complete outage, data loss, or security breach | Full postmortem, all sections required, executive summary |
| **Major** | Significant degradation affecting >50% of users | Full postmortem, all sections required |
| **Minor** | Limited impact, <10% of users, workaround available | Abbreviated postmortem — summary, root cause, action items minimum |

## Postmortem Meeting Guide

If the team holds a postmortem review meeting:

1. **Before the meeting:** Author writes the draft, shares it 24 hours in advance
2. **Meeting structure (30-60 min):**
   - Read the timeline together (5 min)
   - Discuss root cause — add depth if needed (10 min)
   - Review "what went well" — add items (5 min)
   - Review "what went wrong" — add items (10 min)
   - Review "where we got lucky" — this often surfaces the best insights (5 min)
   - Assign owners and due dates to action items (10 min)
3. **After the meeting:** Author updates the draft to Final, creates tickets for action items
4. **Follow-up:** Review action item completion in the next meeting

## Common Postmortem Mistakes

| Mistake | Why it's a problem | Fix |
|---------|-------------------|-----|
| Writing it weeks after the incident | Details are forgotten, timeline is vague | Write within 48 hours of resolution |
| Skipping "what went well" | Team only learns what to avoid, never what to repeat | Require at least 2 items |
| Action items with no owner | Nothing gets done | Every item needs a name (even as TODO) |
| Stopping at the surface cause | Same class of incident recurs | Apply "5 Whys Lite" — go 2-3 levels deep |
| Making it punitive | People hide mistakes, incident culture degrades | Use the blameless test on every sentence |
| Never following up on action items | Postmortems become theater | Review completion in next incident review |
