import { inject, type InjectionKey, type Ref } from 'vue';
import { type Session } from '@supabase/supabase-js';

interface SessionContext {
  session: Ref<Session | null>;
}

export const sessionKey: InjectionKey<SessionContext> = Symbol('session');

export function useSession() {
  const context = inject(sessionKey);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context.session;
}
