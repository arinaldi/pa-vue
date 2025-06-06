import useSWRV, { type IConfig } from 'swrv';

import { ROUTE_HREF } from '@/lib/constants';
import { getReleases, getSongs } from '@/supabase/data';

const config: IConfig = {
  dedupingInterval: Infinity,
  revalidateOnFocus: false,
};

export function useFeaturedSongs() {
  return useSWRV(ROUTE_HREF.FEATURED_SONGS, getSongs, config);
}

export function useNewReleases() {
  return useSWRV(ROUTE_HREF.NEW_RELEASES, getReleases, config);
}
