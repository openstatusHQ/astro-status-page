# Status Page Context — Framework & Checklist

## Completeness Checklist

Use this to verify the context document covers everything downstream skills need.

### Service Overview
- [ ] Company/product name is set
- [ ] Status page URL is provided
- [ ] Primary audience is defined (developers, enterprise, end users, etc.)

### Components
- [ ] Every component on the status page is listed
- [ ] Each component has a human-readable description
- [ ] Criticality is assigned (High / Medium / Low)
- [ ] Components map to what users see, not internal service names

### SLA & Uptime
- [ ] Uptime target is a specific number (e.g., 99.9%)
- [ ] Response time SLA has concrete timeframes (acknowledge in X min, update every Y min)
- [ ] Maintenance window is defined with day/time/timezone
- [ ] SLA consequences are documented (credits, contractual terms, or "none")

### Communication Tone
- [ ] Style is described in 1 sentence (not just "professional")
- [ ] At least 3 words/phrases to use
- [ ] At least 3 words/phrases to avoid
- [ ] At least 1 example sentence that sounds like the brand
- [ ] Voice description is specific enough that two people would write similarly

### Severity Levels
- [ ] All 4 levels defined (Critical, Major, Minor, Maintenance)
- [ ] Each level has concrete criteria (not just "bad" / "very bad")
- [ ] Each level has a real example from the product

### Escalation & Roles
- [ ] Incident commander role is defined
- [ ] Communications lead role is defined
- [ ] Update cadence is set (e.g., every 30 min during critical)
- [ ] Approval process is clear (who signs off, or "no approval needed")

### Notification Channels
- [ ] All active channels are checked
- [ ] At least status page + one other channel

### Past Patterns
- [ ] At least 2 common incident types listed
- [ ] At least 1 recurring root cause
- [ ] At least 1 lesson from a past incident

## Quality Checks

### Tone Test
Read the example sentence aloud. Does it sound like something your team would actually post? If it sounds like a press release, rewrite it.

### Component Test
For each component: if this went down, would a user know what it means? If not, rename it to something user-facing.

### Severity Test
For each severity level: could two different engineers independently classify the same incident the same way? If the criteria are ambiguous, add specifics.

### Freshness Test
- Are all components still active? (No deprecated services listed)
- Do SLA numbers match current contracts?
- Has the team's communication style evolved since this was written?

## When to Update

| Trigger | What to update |
|---------|---------------|
| New component launched | Add to components table |
| Component deprecated | Remove from components table |
| SLA renegotiated | Update SLA section |
| Major incident revealed communication gap | Update tone, severity, or past patterns |
| Team restructure | Update escalation & roles |
| New notification channel added | Update channels list |
