# Incident Communication — Framework & Checklist

## Update Checklist by Phase

### Investigating
- [ ] Names the affected component(s)
- [ ] Describes user-visible impact (what users see, not internal jargon)
- [ ] States what is NOT affected
- [ ] Includes start time in UTC
- [ ] Commits to a next-update time
- [ ] Does NOT speculate on cause (it's ok to say "we're investigating")

### Identified
- [ ] Explains root cause in plain language
- [ ] States the fix plan or workaround
- [ ] Provides ETA for fix, or explicitly says "no ETA yet"
- [ ] Gives actionable guidance if users can mitigate (retry, switch region, redeploy)
- [ ] Updates blast radius if it changed since investigating
- [ ] Commits to next-update time

### Monitoring
- [ ] Explains what fix was deployed (1 sentence)
- [ ] States when the fix was deployed (UTC)
- [ ] Sets monitoring duration ("next 2 hours")
- [ ] Tells users whether they need to take action
- [ ] Notes any temporary workarounds still in place

### Resolved
- [ ] Includes exact start and end times in UTC
- [ ] Summarizes root cause in 1-2 sentences
- [ ] Describes what was done to fix it
- [ ] Quantifies impact if possible (% of requests, # of users, duration)
- [ ] States whether a postmortem will follow (and when)
- [ ] Notes any ongoing preventive measures

## Quality Checks

### The "3am test"
Read the update as if you're a customer seeing it at 3am with a production issue. Does it answer:
1. Is my service affected?
2. What should I do right now?
3. When will I hear more?

If any answer is "I don't know" — rewrite.

### The "new information" test
Compare this update to the previous one. Does it contain at least one piece of new information? If not, either wait until you have something new, or explicitly acknowledge: "No change since last update — we're still [action]. Next update at [time]."

### The "specificity" test
Search the update for these vague phrases and replace them:

| Vague | Specific |
|-------|----------|
| "some users" | "users in the EU region" or "~15% of API requests" |
| "degraded performance" | "response times averaging 8s (normally <200ms)" |
| "recently" | "starting at 14:25 UTC" |
| "shortly" | "within 30 minutes" |
| "some services" | "REST API and webhook delivery" |
| "the issue" | name the actual issue |

### The "empathy without filler" test
Remove any sentence that is purely empathetic without being informative:
- Remove: "We apologize for any inconvenience this may have caused."
- Remove: "Thank you for your patience."
- Keep: "We understand this impacts your production deployments and are prioritizing the fix."

The difference: the third sentence acknowledges impact AND signals action.

## Severity → Update Cadence

| Severity | First update | Subsequent updates | Monitoring duration |
|----------|-------------|-------------------|-------------------|
| Critical | Within 15 min of detection | Every 30 min minimum | 2-4 hours |
| Major | Within 30 min | Every 60 min minimum | 1-2 hours |
| Minor | Within 1 hour | Every 2 hours or as needed | 30-60 min |

These are defaults. Override with values from `.agents/status-page-context.md` if available.

## Multi-update Incident Flow

For incidents lasting more than one update cycle:

```
Update 1 (Investigating): What's happening, who's affected, what's not
Update 2 (Investigating): What we've learned, what we've ruled out
Update 3 (Identified):    Root cause, fix plan, ETA
Update 4 (Monitoring):    Fix deployed, what we're watching
Update 5 (Resolved):      Full summary with timestamps and impact
```

Each update should reference the previous state: "Since our last update, we've [new information]."

## Tone Calibration

| Severity | Tone | Example opener |
|----------|------|---------------|
| Critical | Urgent, direct, frequent | "API is returning 500 errors for all requests starting at 14:00 UTC." |
| Major | Serious, clear, steady | "Dashboard load times are significantly elevated, averaging 12s." |
| Minor | Informative, calm | "Webhook delivery is experiencing delays of 2-5 minutes." |

Regardless of severity:
- Be honest about what you don't know
- Never minimize ("just a small issue") when users are affected
- Never over-dramatize a minor issue
