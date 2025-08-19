import { z } from 'zod';

export type View = 'email' | 'otp' | 'password';

export const emailSchema = z.object({
  email: z.email().trim(),
});

export type EmailInput = z.infer<typeof emailSchema>;

export const signInSchema = z.object({
  password: z.string().trim().min(3, { error: 'Invalid password' }),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const verifyOtpSchema = z.object({
  code: z.array(z.coerce.string()).length(6, { error: 'Invalid code' }),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
