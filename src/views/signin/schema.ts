import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

export type View = 'email' | 'otp' | 'password';

const emailSchema = z.object({
  email: z.string().email().trim(),
});

export const typedEmailSchema = toTypedSchema(emailSchema);
export type EmailInput = z.infer<typeof emailSchema>;

const signInSchema = z.object({
  password: z.string().trim().min(3, { message: 'Invalid password' }),
});

export const typedSignInSchema = toTypedSchema(signInSchema);
export type SignInInput = z.infer<typeof signInSchema>;

const verifyOtpSchema = z.object({
  code: z.array(z.coerce.string()).length(6, { message: 'Invalid code' }),
});

export const typedVerifyOtpSchema = toTypedSchema(verifyOtpSchema);
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
