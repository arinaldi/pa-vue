import useSWRV from 'swrv';

import { ROUTE_HREF } from '@/lib/constants';
import { getReleases } from '@/supabase/data';

export function useNewReleases() {
  return useSWRV(ROUTE_HREF.NEW_RELEASES, getReleases, {
    dedupingInterval: Infinity,
    revalidateOnFocus: false,
  });
}
