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
export const flyRegions =[
  "ams",
  "arn",
  "atl",
  "bog",
  "bom",
  "bos",
  "cdg",
  "den",
  "dfw",
  "ewr",
  "eze",
  "fra",
  "gdl",
  "gig",
  "gru",
  "hkg",
  "iad",
  "jnb",
  "lax",
  "lhr",
  "mad",
  "mia",
  "nrt",
  "ord",
  "otp",
  "phx",
  "qro",
  "scl",
  "sjc",
  "sea",
  "sin",
  "syd",
  "waw",
  "yul",
  "yyz",
] as const;

export const monitorMethods = ["GET", "POST", "HEAD"] as const;

const monitorSchema = z.object({
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

export const monitorsSchema = z.array(monitorSchema);

export const dailyStatsSchema = z.object({
  ok: z.number().int(),
  count: z.number().int(),
  day: z.string(),
});

export const dailyStatsSchemaArray = z.array(dailyStatsSchema);

export const summaryPayload = z.object({ data: dailyStatsSchemaArray });

export type DailyStats = z.infer<typeof dailyStatsSchema>;
export type Monitor = z.infer<typeof monitorSchema>;
