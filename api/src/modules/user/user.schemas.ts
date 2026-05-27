import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().optional(),
  email: z.email("Email is required"),
  password: z.string(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
