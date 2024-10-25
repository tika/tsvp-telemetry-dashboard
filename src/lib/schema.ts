import { z } from "zod";

export const createSnapshotSchema = z.object({
  motorTemperature: z.number(),
  batteryTemperature: z.number(),
  batteryPercentage: z.number(),
  tyrePressure: z.number(),
  speed: z.number(),
  chargeRate: z.number(),
});
