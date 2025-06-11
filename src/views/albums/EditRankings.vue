<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Reorder } from 'motion-v';

import SubmitButton from '@/components/SubmitButton.vue';
import { useTopAlbums } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { MESSAGES, ROUTE_HREF } from '@/lib/constants';
import { supabase } from '@/supabase/client';
import AlbumCard from './AlbumCard.vue';

const route = useRoute();
const router = useRouter();
const year = route.params.year as string;
const { favorites } = route.meta;
const { mutate } = useTopAlbums();

if (!favorites) {
  throw new Error(MESSAGES.INVALID_DATA);
}

const items = ref(favorites);
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    async () => {
      router.push(`${ROUTE_HREF.TOP_ALBUMS}#${year}`);
    },
  ],
  submitFn: async () => {
    const rankings = items.value.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));
    const positions = rankings.map((r) => r.position);
    const positionsSet = new Set(positions);

    if (positionsSet.size !== favorites.length) {
      throw new Error('Rankings must be unique');
    }

    const input = rankings.map((r) => ({
      album_id: r.id,
      position: r.position,
      year,
    }));
    const { error } = await supabase.from('rankings').upsert(input, { onConflict: 'album_id' });

    if (error) {
      throw new Error(error.message);
    }

    await mutate();
  },
  successMessage: `${MESSAGES.RANKING_PREFIX} edited`,
});
</script>

<template>
  <form class="max-w-md space-y-4" @submit.prevent="onSubmit">
    <Reorder.Group v-model:values="items" axis="y" class="space-y-2">
      <AlbumCard
        v-for="(item, index) in items"
        :data-index="index"
        :key="item.id"
        :item="item"
        :position="index + 1"
      />
    </Reorder.Group>
    <SubmitButton class="w-full sm:w-auto" :submitting="submitting"> Save </SubmitButton>
  </form>
</template>
