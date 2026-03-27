# Common Performance Issues - Quick Reference

## Diagnostic Flow

```
High latency detected
    ↓
Which phase is slow?
    ├─ DNS → DNS provider issues
    ├─ Connection → Server capacity or distance
    ├─ TLS → TLS version or session resumption
    ├─ TTFB → Server processing bottleneck
    └─ Transfer → Payload size or compression
```

## Issue Categories

### DNS Issues

**High DNS globally (>50ms everywhere)**
- Likely: Slow DNS provider, no Anycast
- Fix: Switch to Cloudflare DNS, Route 53, or Google Cloud DNS
- Impact: 50-100ms → 10-30ms

**High DNS variance between regions**
- Likely: Poor global DNS coverage
- Fix: Use globally-distributed DNS with Anycast
- Impact: Consistent 10-30ms globally

### Connection Issues

**High connection globally (>100ms even nearby)**
- Likely: Server overload, firewall/LB latency
- Fix: Scale up/out, optimize TCP settings
- Impact: Drop to 10-30ms locally

**Connection increases excessively with distance**
- Likely: Suboptimal routing, no multi-region deployment
- Fix: Deploy to multiple regions, use CDN with good peering
- Impact: Match geographic distance expectations

### TLS Issues

**High TLS globally (>80ms average)**
- Likely: TLS 1.2, no session resumption, large cert chain
- Fix: Enable TLS 1.3, session resumption, OCSP stapling
- Impact: 90-120ms → 30-60ms

**TLS proportional to connection time**
- Normal when TLS optimization not enabled
- Fix: Enable TLS 1.3, session resumption

### TTFB Issues

**High TTFB everywhere (>300ms even locally)**
- Likely: Slow database queries, unoptimized code, no caching
- Fix: Add caching, optimize queries, profile code
- Impact: 300-500ms → 50-150ms

**TTFB varies wildly (100ms to 1000ms)**
- Likely: Cold starts, cache misses, variable load
- Fix: Provisioned concurrency, cache warming, auto-scaling
- Impact: Consistent TTFB with <20% variance

**TTFB high only in some regions**
- Likely: Database far from API server
- Fix: Co-locate DB and API, add read replicas, edge database
- Impact: TTFB becomes consistent globally (±30ms)

### Transfer Issues

**High transfer globally (>200ms)**
- Likely: Large payload, no compression
- Fix: Enable gzip/brotli, reduce payload size, pagination
- Impact: 200ms+ → 10-50ms with compression

**Transfer proportional to distance**
- Normal for origin-served content
- Fix: Use CDN, enable HTTP/2 or HTTP/3

### Regional Performance Gaps

**APAC 2-3x slower than US/EU**
- Likely: Server in US/EU only, no APAC infrastructure
- Fix: Deploy to Singapore/Tokyo, use global CDN, edge computing
- Impact: 300ms+ → 80-150ms in APAC

**All regions failing in one continent**
- Likely: Geo-blocking, firewall rules, aggressive DDoS protection
- Fix: Review geo-blocking, adjust WAF settings

### Intermittent Failures

**Some regions fail sometimes**
- Likely: Capacity issues, health check failures, rate limiting
- Fix: Scale capacity, adjust health checks, review rate limits

## Summary Table

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| DNS > 50ms globally | Slow DNS provider | Switch to Cloudflare DNS |
| Connection > 100ms locally | Server overload | Scale up |
| TLS > 80ms average | TLS 1.2, no resumption | Enable TLS 1.3 |
| TTFB > 300ms everywhere | Slow code/DB | Add caching |
| TTFB varies 100-1000ms | Cold starts | Keep warm |
| Transfer > 200ms | Large/uncompressed | Enable gzip |
| APAC 3x slower | US/EU-only deployment | Add CDN |

## Quick Wins

**Fastest impact (<1 hour):**
1. Enable gzip/brotli compression
2. Switch to Cloudflare DNS
3. Enable CDN caching

**High impact (<1 day):**
4. Add database indexes
5. Enable TLS 1.3
6. Implement caching (Redis)

**Strategic (<1 week):**
7. Deploy to multiple regions
8. Add database read replicas
9. Optimize application code
