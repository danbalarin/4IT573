import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod
    .string()
    .min(4)
    .max(20)
    .refine(
      (val) =>
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g.test(val),
      {
        message:
          "Password have to contain one lowercase, one uppercase and one number"
      }
    )
});

export type LoginSchemaType = zod.infer<typeof loginSchema>;
