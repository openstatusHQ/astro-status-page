# HTTP Request Timing Phases

## Overview

Total Latency = DNS + Connection + TLS + TTFB + Transfer

## Timing Phases

### DNS (Domain Name Resolution)

**What it measures:** Time to resolve domain name to IP address.

**How it works:** Client queries DNS server, receives IP address in response.

**Typical values:**
- Fast: <20ms
- Normal: 20-50ms
- Slow: >50ms

**Affected by:** DNS provider performance, geographic distance to DNS servers, DNS caching, TTL settings.

---

### Connection (TCP Handshake)

**What it measures:** Time to establish TCP connection with server.

**How it works:** 3-way handshake (SYN, SYN-ACK, ACK) between client and server.

**Typical values:**
- Fast: <30ms
- Normal: 30-100ms
- Slow: >100ms

**Affected by:** Geographic distance (round-trip time), network quality, server load, firewall/routing complexity.

---

### TLS (SSL/TLS Handshake)

**What it measures:** Time to complete TLS/SSL handshake for HTTPS.

**How it works:** ClientHello, ServerHello, certificate exchange, key exchange, encryption established.

**Typical values:**
- Fast: <40ms
- Normal: 40-80ms
- Slow: >80ms

**Affected by:** TLS version (1.3 faster than 1.2), certificate chain length, cipher suite complexity, session resumption, OCSP stapling.

**Note:** Only occurs for HTTPS requests.

---

### TTFB (Time To First Byte)

**What it measures:** Time from sending request to receiving first byte of response.

**How it works:** Server processes request (DB queries, business logic), then starts sending response.

**Typical values:**
- Fast: <100ms
- Normal: 100-300ms
- Slow: >300ms

**Affected by:** Server processing time, database query performance, cold starts, cache hit/miss ratio, server load.

**Red flags:**
- TTFB >500ms: Server processing bottleneck
- TTFB varies widely: Cache inconsistency or cold starts
- TTFB higher in some regions: Regional backend issues

---

### Transfer (Response Download)

**What it measures:** Time to download response body after first byte.

**How it works:** Server streams response body in chunks to client.

**Typical values:**
- Fast: <50ms (small responses)
- Normal: 50-200ms (medium responses)
- Slow: >200ms (large responses)

**Affected by:** Response size, network bandwidth, compression (gzip/brotli), server upload speed, network congestion.

## Interpreting Patterns

- **All phases slow:** Server generally slow or under heavy load
- **High DNS everywhere:** Slow DNS provider
- **High Connection + TLS distant regions:** Server in one location only
- **High TTFB only:** Server processing bottleneck
- **High Transfer only:** Large response or poor compression
- **Some regions fail:** Firewall, geo-blocking, or regional outages
