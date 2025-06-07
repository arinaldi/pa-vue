import {
  formatFavorites,
  formatRankingsAllTime,
  formatReleases,
  formatSongs,
} from '@/lib/formatters';
import { supabase } from '@/supabase/client';

export async function getAllTimeRankings() {
  const { data, error } = await supabase
    .from('rankings')
    .select(
      `
            all_time_position,
            id,
            position,
            album:albums (
              artist,
              id,
              title,
              year
            )
          `,
    )
    .gte('all_time_position', 1)
    .order('all_time_position', { ascending: true });

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    favorites: formatRankingsAllTime(data),
  };
}

interface Artist {
  artist: string;
}

export async function getArtists() {
  const { data, error } = await supabase.rpc('get_artists');

  if (error) throw new Error(error.message);

  const artists = data as unknown as Artist[];

  return {
    artists: artists.map((a) => a.artist),
    count: artists.length,
  };
}

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
