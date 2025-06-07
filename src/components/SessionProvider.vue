<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue';
import { type Session } from '@supabase/supabase-js';

import { sessionKey } from '@/lib/utils';
import { supabase } from '@/supabase/client';

const session = ref<Session | null>(null);

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});

provide(sessionKey, session);
</script>

<template>
  <slot />
</template>
