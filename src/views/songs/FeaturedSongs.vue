<script lang="ts" setup>
import LetterLink from '@/views/songs/LetterLink.vue';
import TopLink from '@/components/TopLink.vue';
import { useFeaturedSongs } from '@/lib/use-data';

const { data } = useFeaturedSongs();
const songs = data?.value?.songs ?? {};
</script>

<template>
  <div class="space-y-4" id="top">
    <!-- <AddSongModal /> -->
    <LetterLink />
    <div class="flex flex-col gap-8">
      <template v-for="[letter, items] in Object.entries(songs)" :key="letter">
        <div v-if="items.length > 0">
          <h2 class="border-b pb-2 text-xl font-semibold tracking-tight" :id="`letter-${letter}`">
            {{ letter }}
          </h2>
          <ul class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <li v-for="item in items" :key="item.id" class="text-sm">
              <span class="flex items-center gap-2">
                <span>
                  <span class="text-muted-foreground"> {{ item.artist }} &ndash; </span>{{ ' ' }}
                  <a
                    class="hover:text-muted-foreground underline underline-offset-4"
                    :href="item.link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {{ item.title }}
                  </a>
                </span>
                <!-- <SongActions song={s} /> -->
              </span>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
  <TopLink />
</template>
