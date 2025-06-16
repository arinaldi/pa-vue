<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { Reorder } from 'motion-v';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import DataEmptyPlaceholder from '@/components/DataEmptyPlaceholder.vue';
import SubmitButton from '@/components/SubmitButton.vue';
import { useAllTimeRankings } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { MESSAGES, ROUTE_HREF } from '@/lib/constants';
import { supabase } from '@/supabase/client';
import AlbumCard from './AlbumCard.vue';
import Search from './Search.vue';
import { getCandidates } from '@/supabase/data';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const { favorites } = route.meta;

if (!favorites) {
  throw new Error(MESSAGES.INVALID_DATA);
}

const { mutate } = useAllTimeRankings();
const items = ref(favorites);
const data = ref<Awaited<ReturnType<typeof getCandidates>>>({
  candidates: [],
});

watch(() => route.query, getData, { immediate: true });

async function getData(adminParams: LocationQuery) {
  try {
    loading.value = true;
    data.value = await getCandidates(adminParams);
  } catch (error) {
    const message = error instanceof Error ? error.message : MESSAGES.ERROR;
    toast.error(message);
  } finally {
    loading.value = false;
  }
}

function removeItem(id: number) {
  items.value = items.value.filter((item) => item.id !== id);
}

const { onSubmit, submitting } = useSubmit({
  callbacks: [() => router.push(ROUTE_HREF.ALL_TIME)],
  submitFn: async () => {
    const rankings = items.value.map((item, index) => ({
      album_id: item.id,
      all_time_position: index + 1,
      position: item.ranking,
      year: item.year,
    }));
    const { error } = await supabase.from('rankings').upsert(rankings, { onConflict: 'album_id' });

    if (error) {
      throw new Error(error.message);
    }

    await mutate();
  },
  successMessage: `${MESSAGES.RANKING_PREFIX} edited`,
});
</script>

<template>
  <div className="max-w-7xl">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
      <div>
        <Search :searching="loading" />
        <div
          v-if="data.candidates.length === 0 && route.query.search && !loading"
          class="mt-4 flex justify-center"
        >
          <DataEmptyPlaceholder />
        </div>
        <div v-if="data.candidates.length" class="mt-4 space-y-3 rounded-md border p-4">
          <div
            v-for="candidate in data.candidates"
            class="flex items-start justify-between gap-2"
            :key="candidate.id"
          >
            <div>
              <p class="text-sm font-medium">{{ candidate.title }}</p>
              <p class="text-muted-foreground text-sm">
                {{ candidate.artist }}
              </p>
              <p class="text-muted-foreground text-xs">{{ candidate.year }}</p>
            </div>
            <Button
              :disabled="items.some((item) => item.id === candidate.id)"
              @click="items.push(candidate)"
              size="sm"
              variant="outline"
              >Add</Button
            >
          </div>
        </div>
      </div>
      <form className="space-y-4" @submit.prevent="onSubmit">
        <Reorder.Group v-model:values="items" axis="y" class="space-y-2">
          <AlbumCard
            v-for="(item, index) in items"
            :data-index="index"
            :key="item.id"
            :item="item"
            :position="index + 1"
            @remove="removeItem"
            showRemove
          />
        </Reorder.Group>
        <SubmitButton class="w-full sm:w-auto" :submitting="submitting">Save</SubmitButton>
      </form>
    </div>
  </div>
</template>
