import { formatReleases, formatSongs } from '@/lib/formatters';
import { supabase } from '@/supabase/client';

export async function getReleases() {
  const { data, error } = await supabase.from('releases').select('*').order('artist');

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    releases: formatReleases(data),
  };
}

export async function getSongs() {
  const { data, error } = await supabase.from('songs').select('*').order('artist');

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    songs: formatSongs(data),
  };
}
