import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const releaseSchema = z.object({
  artist: z.string().min(1).max(128),
  title: z.string().min(1).max(128),
  date: z.string().or(z.literal('')),
});

export const typedReleaseSchema = toTypedSchema(releaseSchema);
export type ReleaseInput = z.infer<typeof releaseSchema>;
