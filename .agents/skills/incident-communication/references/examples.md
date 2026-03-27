# Incident Communication — Good vs Bad Examples

Real-world examples from public status pages, analyzed for what works and what doesn't.

---

## Investigating Phase

### Bad: Too vague (GitHub pattern)

> We are investigating reports of degraded performance for some GitHub services.

**Problems:**
- "Some services" — which ones?
- "Degraded performance" — what does the user see?
- No timestamp, no scope, no next-update commitment

### Bad: Templated and robotic (Cloudflare pattern)

> Cloudflare is investigating issues with network performance in Warsaw, Poland (WAW). We are working to analyse and mitigate this problem. More updates to follow shortly.

**Problems:**
- Third-person is unnecessarily formal
- "More updates to follow shortly" — when exactly?
- Doesn't say what users experience

### Good: Scoped with user impact (Vercel pattern)

> We are currently investigating reports of elevated error rates on the Vercel Dashboard. Existing deployments and live traffic are not affected by this issue. We will share updates as they become available.

**Why it works:**
- Names the affected component (Dashboard)
- Immediately reassures about what's NOT affected (deployments, live traffic)
- Users know whether they need to care

### Good: Specific with timestamps (Stripe pattern)

> We're currently observing elevated errors on the iDEAL payment method that began at 14:25 UTC. This issue is external to Stripe. We are actively monitoring the situation and will provide updates as more information becomes available.

**Why it works:**
- Exact start time in UTC
- Names the specific payment method
- Transparent about external cause
- Concise

### Best: Scoped + actionable

> REST API requests to /v1/monitors are returning 503 errors starting at 14:25 UTC. The dashboard, status pages, and webhook delivery are operating normally. We're investigating the cause and will post an update within 30 minutes.

**Why it's best:** Combines specific scope, user impact, blast radius, timestamp, and next-update commitment in 3 sentences.

---

## Identified Phase

### Bad: Boilerplate (Cloudflare pattern)

> The issue has been identified and a fix is being implemented.

**Problems:**
- What issue? What fix?
- Identical text used for every incident regardless of severity
- No ETA, no user guidance

### Good: Explains cause and plan (Vercel pattern)

> Some deployments created between 11:20 UTC and 15:14 UTC with Edge Middleware may be seeing elevated errors. Deployments created outside of this time window are unaffected. If you are experiencing issues, we recommend redeploying.

**Why it works:**
- Precise blast radius (time window + feature)
- Clear "not affected" scope
- Actionable workaround for users

### Good: Progressive detail (GitHub Copilot Agent incident)

> We are seeing widespread issues starting and viewing Copilot Agent sessions. We understand the cause and are working on remediation.

**Why it works:**
- Admits the scope is "widespread" (honest)
- "We understand the cause" signals progress without overcommitting on details

---

## Monitoring Phase

### Bad: Template with no detail

> A fix has been implemented and we are monitoring the results.

**Problems:**
- What fix? How long will monitoring last?
- Users don't know if they need to do anything

### Good: Specific fix with timeline

> We've rolled out a fix that excludes the Dubai region (dxb1) from deployment targets as a temporary measure. Builds should complete successfully again. We're monitoring for stability over the next 2 hours.

**Why it works:**
- Explains what the fix actually does
- Sets a monitoring timeline
- Tells users what to expect ("builds should complete successfully")

---

## Resolved Phase

### Bad: No information (Cloudflare pattern)

> This incident has been resolved.

**Problems:**
- No timeline, no cause, no impact summary
- Users who missed the incident learn nothing
- No postmortem commitment

### Bad: Generic with empty empathy

> This incident has been resolved. We apologize for any inconvenience this may have caused. Thank you for your patience.

**Problems:**
- Still no useful information
- "Apologize for any inconvenience" is corporate filler

### Good: Full summary with timestamps (Stripe pattern)

> Between 14:25 - 14:45 UTC there was a disruption with the iDEAL payment method causing increased error rates for iDEAL transactions. The issue was external to Stripe and is now resolved.

**Why it works:**
- Exact time window
- Clear cause attribution
- Concise

### Best: Complete resolved with postmortem (GitHub Copilot Agent incident)

> On March 19, 2026, between 01:05 UTC and 02:52 UTC, and again on March 20, 2026, between 00:42 UTC and 01:58 UTC, the Copilot Coding Agent service was degraded and users were unable to start new Copilot Agent sessions or view existing ones. During the first incident, the average error rate was ~53% and peaked at ~93% of requests to the service. [...] Both incidents were caused by the same underlying system authentication issue that prevented the service from connecting to its backing datastore. We mitigated each incident by rotating the affected credentials [...] We are implementing automated monitoring for credential lifecycle events and improving operational processes to reduce our time to detection and mitigation.

**Why it's best:**
- Exact timestamps for both occurrences
- Quantified impact (error rates with peaks)
- Clear root cause explanation
- Specific mitigation action
- Forward-looking preventive measures

---

## Cross-cutting Patterns

### What the best communicators do consistently:
1. **Scope immediately** — name what's affected AND what's not (Vercel)
2. **Timestamp everything** — exact UTC times, not "recently" (Stripe)
3. **Give actionable guidance** — tell users what they can do (Vercel)
4. **Each update adds information** — never repeat the same text (GitHub at its best)
5. **Resolved = summary** — full timeline, cause, impact, next steps (Stripe, GitHub)
6. **Attribute external causes** — be transparent about third-party issues (Stripe)

### What the worst communicators do:
1. **Copy-paste the same template** for every incident regardless of context (Cloudflare)
2. **Stay vague** — "some services," "degraded performance" (GitHub's first updates)
3. **Repeat identical updates** — "We are continuing to investigate" 3x (Cloudflare Jakarta)
4. **Empty resolved messages** — "This incident has been resolved." (Cloudflare, Vercel sometimes)
5. **Skip intermediate phases** — jump from investigating to resolved (Stripe sometimes)
