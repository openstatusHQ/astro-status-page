# Insights Generation Guide

## Overview

Generate actionable, clear, and prioritized insights from performance data.

## Key Patterns

### Status Code Analysis

- **All success (2xx):** ✓ All regions returned success status
- **Partial failures:** ⚠ X regions returned errors - list them with status codes
- **Continental failures:** ⚠ All [continent] regions failing - possible geo-blocking
- **Redirects (3xx):** Consider updating URL to final destination

### Regional Performance Gaps

- **Consistent performance:** ✓ Performance consistent across regions (when max/min ratio < 1.3)
- **Continental disparity:** ⚠ [Continent] is Xx slower than [other] (when continent_avg / global_avg > 1.5)
- **Single outlier:** ⚠ [Region] is Xx slower than neighbors

### TLS Performance

- **Optimized:** ✓ TLS handshake optimized (avg < 40ms)
- **Slow:** ⚠ TLS slow (avg > 60ms) - consider TLS 1.3 or session resumption
- **Proportional to connection:** Normal when TLS optimization not enabled

### TTFB Analysis

- **Fast:** ✓ Server response time fast (avg < 100ms)
- **Slow globally:** ⚠ High TTFB everywhere - indicates server processing bottleneck
- **Regional variation:** TTFB increases with distance - expected for single-region deployment
- **Extreme outlier:** ⚠ Extreme TTFB in [region] (>500ms while others <200ms)

### DNS Performance

- **Fast:** ✓ DNS resolution fast (avg < 20ms)
- **Slow:** ⚠ DNS slow (avg > 50ms) - consider faster DNS provider

### Transfer Time

- **Efficient:** ✓ Response transfer efficient (compression working)
- **Slow:** ⚠ Transfer time high - large response or poor compression

## Insight Priority Order

1. **Critical errors** - Regions failing completely
2. **Performance outliers** - Regions with extreme latency
3. **Optimization wins** - Things working well
4. **Regional gaps** - Continental disparities
5. **Specific bottlenecks** - Phase-specific issues
6. **Overall assessment** - General performance summary

## Threshold Reference

| Metric | Fast | Normal | Slow | Very Slow |
|--------|------|--------|------|-----------|
| **DNS** | <20ms | 20-50ms | 50-100ms | >100ms |
| **Connection** | <30ms | 30-100ms | 100-200ms | >200ms |
| **TLS** | <40ms | 40-80ms | 80-120ms | >120ms |
| **TTFB** | <100ms | 100-300ms | 300-500ms | >500ms |
| **Transfer** | <50ms | 50-200ms | 200-400ms | >400ms |
| **Total** | <200ms | 200-500ms | 500-1000ms | >1000ms |

**Context matters:** Thresholds vary by endpoint type (static vs API), operation (read vs write), and distance.

## Detection Patterns

### CDN Active
- Consistent TTFB across regions (±20ms)
- Low connection + TLS globally
- Very low transfer time
- **Insight:** ✓ CDN appears active - consistent edge performance

### Cold Starts
- Some regions TTFB >1000ms, others <200ms
- High TTFB variance
- **Insight:** ⚠ High TTFB variance suggests cold starts

### Database Location
- TTFB low in one region (~50ms)
- TTFB increases with distance from that region
- **Insight:** TTFB pattern suggests database in [region]

### Compression Issues
- Transfer time high (>200ms) and consistent
- Good connection quality
- **Insight:** ⚠ High transfer despite good connectivity - enable compression
