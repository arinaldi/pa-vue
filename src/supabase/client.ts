import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'vue-router';

import { ROUTE_HREF } from '@/lib/constants';
import type { Database } from './db-types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export async function validateSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const router = useRouter();
    throw router.push(ROUTE_HREF.NOT_FOUND);
  }

  return true;
}
