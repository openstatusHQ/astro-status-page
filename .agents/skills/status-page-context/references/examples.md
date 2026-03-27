# Status Page Context — Good vs Bad Examples

## Communication Tone

### Bad: Vague and corporate

```
Style: Professional
Voice: We aim to maintain a high standard of communication.
Words to avoid: bad words
```

**Why it's bad:** Too generic. Every company thinks they're "professional." Doesn't help an AI write in your voice.

### Good: Specific and actionable

```
Style: Conversational but precise — like a senior engineer explaining to a colleague
Voice: Calm, direct, technically honest. Admit what we don't know. Never deflect blame.
Words to use: "investigating," "identified," "root cause," "we're working on"
Words to avoid: "we apologize for any inconvenience," "some users may experience," "please be patient"
Example good sentence:
> "We've identified the root cause — a misconfigured load balancer rule deployed at 14:32 UTC. We're rolling back now and expect recovery within 10 minutes."
```

**Why it's good:** An AI can actually write in this voice. The example sentence is a concrete reference point.

---

## Components

### Bad: Too vague

```
| Component | Description | Criticality |
|-----------|-------------|-------------|
| Backend   | The backend  | High        |
| Frontend  | The frontend | High        |
```

**Why it's bad:** "Backend" could mean 50 things. Doesn't help scope an incident to affected services.

### Good: Specific and user-facing

```
| Component | Description | Criticality |
|-----------|-------------|-------------|
| REST API  | Public API at api.example.com — serves all integrations | High |
| Dashboard | Web app at app.example.com — monitoring config and analytics | High |
| Webhooks  | Outbound event delivery to customer endpoints | Medium |
| Status Page | Public status page at status.example.com | Low |
| Email Notifications | Alert delivery via email (SendGrid) | Medium |
```

**Why it's good:** Each component maps to something a user would recognize. Criticality is justified by what depends on it.

---

## Severity Levels

### Bad: Copy-pasted from a template

```
| Level | Criteria |
|-------|----------|
| Critical | Very bad |
| Major | Bad |
| Minor | Not great |
```

### Good: Concrete with real examples

```
| Level | Criteria | Example |
|-------|----------|---------|
| Critical | Complete outage — no requests succeed, or data integrity at risk | API returns 500 for all endpoints; database corruption detected |
| Major | Severe degradation — most users affected, no workaround | Dashboard unresponsive; check results delayed >15 min |
| Minor | Partial degradation — subset of users or workaround exists | Webhook delivery delayed 2-5 min; one region slow |
| Maintenance | Planned work with expected downtime or degradation | Database migration; certificate rotation |
```

---

## SLA & Uptime

### Bad: Aspirational but uncommitted

```
Uptime target: We try to be up as much as possible
Response time SLA: We respond quickly
```

### Good: Concrete numbers

```
Uptime target: 99.9% (allows ~8.7 hours downtime/year)
Response time SLA: Acknowledge critical incidents within 15 minutes, post first public update within 30 minutes
Maintenance window: Tuesdays and Thursdays, 02:00-04:00 UTC (announced 72 hours in advance)
SLA consequences: Pro plan customers receive 10x credit for downtime exceeding SLA
```
