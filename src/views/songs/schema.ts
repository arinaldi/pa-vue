import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const songSchema = z.object({
  artist: z.string().min(1).max(128),
  title: z.string().min(1).max(128),
  link: z.string().url({ message: 'Link is invalid' }),
});

export const typedSongSchema = toTypedSchema(songSchema);
export type SongInput = z.infer<typeof songSchema>;
