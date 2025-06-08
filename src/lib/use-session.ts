import { inject, type InjectionKey, type Ref } from 'vue';
import { type Session } from '@supabase/supabase-js';

export const sessionKey = Symbol() as InjectionKey<Ref<Session | null>>;

export function useSession() {
  return inject(sessionKey);
}
