<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputClearButton from '@/components/InputClearButton.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useArtists } from '@/lib/use-data';

const { data } = useArtists();
const artists = data?.value?.artists ?? [];
const search = ref('');
const input = ref();
const randomArtist = ref('');
const filteredArtists = computed(() =>
  search.value
    ? artists.filter((artist) => artist.toLowerCase().includes(search.value.toLowerCase()))
    : artists,
);

function onClear() {
  search.value = '';
  input.value?.$el?.focus();
}

function onShuffle() {
  const index = Math.floor(Math.random() * artists.length);
  randomArtist.value = artists[index];
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
    <div class="flex shrink-0 flex-col gap-4">
      <div class="relative">
        <Input autofocus name="artists" placeholder="Search" ref="input" v-model="search" />
        <InputClearButton v-if="search" @clear="onClear" />
      </div>
      <ScrollArea class="max-h-[400px] rounded-md border sm:max-h-[800px]">
        <div class="p-4">
          <div v-for="(artist, index) in filteredArtists" :key="artist">
            <p class="text-sm">{{ artist }}</p>
            <Separator v-if="index !== filteredArtists.length - 1" class="my-2" />
          </div>
        </div>
      </ScrollArea>
    </div>
    <div class="flex shrink-0 flex-col gap-4">
      <div class="flex items-center gap-4">
        <Button @click="onShuffle" variant="outline">Shuffle</Button>
        <p class="text-sm">{{ randomArtist }}</p>
      </div>
    </div>
  </div>
</template>
