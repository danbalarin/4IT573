import * as zod from "zod";

export const safeTextSchema = zod.object({
  text: zod.string().min(1).max(1000),
  domain: zod.string().optional()
});

export type SafeTextSchemaType = zod.infer<typeof safeTextSchema>;
