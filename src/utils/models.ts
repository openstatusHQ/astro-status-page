import { z } from "zod";

export const monitorPeriodicity = [
  "30s",
  "1m",
  "5m",
  "10m",
  "30m",
  "1h",
  "other",
] as const;

export const periodicityEnum = z.enum(monitorPeriodicity);
export const flyRegions = ["ams", "iad", "hkg", "jnb", "syd", "gru"] as const;
export const monitorMethods = ["GET", "POST", "HEAD"] as const;

const MonitorSchema = z.object({
  id: z.number(),
  periodicity: periodicityEnum,
  url: z.string().url(),
  regions: z.array(z.enum(flyRegions)),
  name: z.string().nullable(),
  description: z.string().nullable(),
  method: z.enum(monitorMethods),
  body: z.string(),
  headers: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .default([]),
  active: z.boolean(),
});

export const MonitorsSchema = z.array(MonitorSchema);

export const dailyStatsSchema = z.object({
  ok: z.number().int(),
  count: z.number().int(),
  day: z.string(),
});

export const dailyStatsSchemaArray = z.array(dailyStatsSchema);

export const summaryPayload = z.object({data: dailyStatsSchemaArray});