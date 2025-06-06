import { formatFavorites, formatReleases, formatSongs } from '@/lib/formatters';
import { supabase } from '@/supabase/client';

export async function getFavorites() {
  const { data, error } = await supabase
    .from('albums')
    .select(
      `
        artist,
        artist_title,
        cd,
        created_at,
        favorite,
        id,
        studio,
        title,
        wishlist,
        year,
        ranking:rankings (
          position
      )
      `,
    )
    .eq('favorite', true)
    .order('artist', { ascending: true });

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    favorites: formatFavorites(data),
  };
}

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
