import { type LocationQuery } from 'vue-router';

import { MESSAGES, PER_PAGE, SORT_DIRECTION } from '@/lib/constants';
import {
  formatFavorites,
  formatRankingsAllTime,
  formatRankingsByYear,
  formatReleases,
  formatSongs,
} from '@/lib/formatters';
import { supabase } from '@/supabase/client';

const { ASC, DESC } = SORT_DIRECTION;

export async function getAlbum(id: string | undefined) {
  if (!id) {
    throw new Error(MESSAGES.NO_DATA);
  }

  const { data: album, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', parseInt(id, 10))
    .single();

  if (error) throw new Error(error.message);

  return { album };
}

async function getAlbums(adminParams: LocationQuery) {
  const { cd, favorite, sort, studio, wishlist } = adminParams;
  const page = typeof adminParams.page === 'string' ? parseInt(adminParams.page, 10) : 1;
  const perPage =
    typeof adminParams.perPage === 'string' ? parseInt(adminParams.perPage, 10) : PER_PAGE.SMALL;
  const [sortProp, desc] = typeof sort === 'string' ? sort.split(':') : [];
  const direction = desc ? DESC : ASC;
  const start = (page - 1) * perPage;
  const end = page * perPage - 1;
  const search = typeof adminParams.search === 'string' ? adminParams.search.trim() : '';
  const searchTerm = `%${search}%`;

  let query = supabase
    .from('albums')
    .select('*', { count: 'exact' })
    .or(`artist.ilike.${searchTerm}, title.ilike.${searchTerm}`)
    .range(start, end);

  if (cd) {
    query = query.eq('cd', cd === 'true');
  }

  if (favorite) {
    query = query.eq('favorite', favorite === 'true');
  }

  if (studio) {
    query = query.eq('studio', studio === 'true');
  }

  if (wishlist) {
    query = query.eq('wishlist', wishlist === 'true');
  }

  if (sortProp) {
    query = query.order(sortProp, { ascending: direction === ASC });
  } else {
    query = query.order('artist', { ascending: true }).order('title', { ascending: true });
  }

  if (sortProp === 'artist') {
    query = query.order('title', { ascending: true });
  } else {
    query = query.order('artist', { ascending: direction === ASC });
  }

  const { count, data: albums, error } = await query;

  if (error) throw new Error(error.message);

  return {
    albums,
    count: count ?? 0,
  };
}

async function getCdCount(adminParams: LocationQuery) {
  const { cd, favorite, search, studio, wishlist } = adminParams;
  const searchTerm = `%${search}%`;

  let query = supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
    .eq('cd', true)
    .or(`artist.ilike.${searchTerm}, title.ilike.${searchTerm}`);

  if (cd) {
    query = query.eq('cd', cd === 'true');
  }

  if (favorite) {
    query = query.eq('favorite', favorite === 'true');
  }

  if (studio) {
    query = query.eq('studio', studio === 'true');
  }

  if (wishlist) {
    query = query.eq('wishlist', wishlist === 'true');
  }

  const { count, error } = await query;

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function getAdminData(adminParams: LocationQuery) {
  const [{ albums, count }, cdCount] = await Promise.all([
    getAlbums(adminParams),
    getCdCount(adminParams),
  ]);

  return {
    albums,
    cdCount,
    count,
  };
}

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

export async function getRankingsByYear(year: string) {
  const { data, error } = await supabase
    .from('albums')
    .select(
      `
      artist,
      id,
      title,
      year,
      ranking:rankings (
        all_time_position,
        id,
        position
      )
    `,
    )
    .match({ favorite: true, year });

  if (error) throw new Error(error.message);

  return {
    count: data.length,
    favorites: formatRankingsByYear(data),
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
