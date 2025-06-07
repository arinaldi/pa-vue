import useSWRV, { type IConfig } from 'swrv';

import { ROUTE_HREF } from '@/lib/constants';
import {
  getAllTimeRankings,
  getArtists,
  getFavorites,
  getReleases,
  getSongs,
} from '@/supabase/data';

const config: IConfig = {
  dedupingInterval: Infinity,
  revalidateOnFocus: false,
};

export function useAllTimeRankings() {
  return useSWRV(ROUTE_HREF.ALL_TIME, getAllTimeRankings, config);
}

export function useArtists() {
  return useSWRV(ROUTE_HREF.ARTISTS, getArtists, config);
}

export function useFeaturedSongs() {
  return useSWRV(ROUTE_HREF.FEATURED_SONGS, getSongs, config);
}

export function useNewReleases() {
  return useSWRV(ROUTE_HREF.NEW_RELEASES, getReleases, config);
}

export function useTopAlbums() {
  return useSWRV(ROUTE_HREF.TOP_ALBUMS, getFavorites, config);
}
