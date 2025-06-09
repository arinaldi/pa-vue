<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputClearButton from '@/components/InputClearButton.vue';
import InputSpinner from '@/components/InputSpinner.vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MESSAGES } from '@/lib/constants';
import { useArtists } from '@/lib/use-data';
import { useSession } from '@/lib/use-session';
import { cn } from '@/lib/utils';
import {
  getAccessToken,
  getArtistAlbums,
  getArtistId,
  sortByDateDesc,
  type Result,
} from './helpers';

interface State {
  artist: string;
  data: Result[];
  token: string;
}

const session = useSession();
const { data } = useArtists();
const artists = data?.value?.artists ?? [];
const search = ref('');
const input = ref();
const randomArtist = ref('');
const fetching = ref(false);
const results = reactive<State>({
  artist: '',
  data: [],
  token: '',
});
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

async function fetchReleases(artist: string) {
  try {
    fetching.value = true;
    let { token } = results;

    if (!token) {
      token = await getAccessToken();

      if (!token) {
        throw new Error('No access token');
      }
    }

    const artistId = await getArtistId(token, artist);

    if (!artistId) {
      throw new Error('No artist ID');
    }

    const data = await getArtistAlbums(token, artistId);

    if (!data) {
      throw new Error('Failed to fetch releases');
    }

    results.artist = artist;
    results.data = data.sort(sortByDateDesc);
    results.token = token;
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : MESSAGES.ERROR;

    toast.error(message);
  } finally {
    fetching.value = false;
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
    <div class="flex shrink-0 flex-col gap-4">
      <div class="relative">
        <Input autofocus name="artists" placeholder="Search" ref="input" v-model="search" />
        <InputClearButton v-if="!fetching && search" @clear="onClear" />
        <InputSpinner v-if="fetching" />
      </div>
      <ScrollArea class="max-h-[400px] rounded-md border sm:max-h-[800px]">
        <div class="p-4">
          <div v-for="(artist, index) in filteredArtists" :key="artist">
            <Button
              v-if="session"
              :class="
                cn(
                  'text-foreground block h-auto px-0 py-0.5 text-left text-sm',
                  results.artist === artist ? 'font-semibold' : 'font-normal',
                )
              "
              @click="fetchReleases(artist)"
              :disabled="fetching"
              size="sm"
              variant="link"
              >{{ artist }}</Button
            >
            <p v-else class="text-sm">{{ artist }}</p>
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
      <ScrollArea
        v-if="results.data.length > 0"
        class="max-h-[400px] rounded-md border sm:max-h-[800px]"
      >
        <div className="p-4">
          <Badge variant="secondary">{{ results.data.length.toLocaleString() }}</Badge>
          <ul className="mt-4 space-y-4">
            <li v-for="item in results.data" :key="item.id" class="space-y-1 text-sm">
              <a
                :class="
                  cn(
                    'hover:text-muted-foreground block underline underline-offset-4',
                    item.type === 'album' ? 'font-medium' : 'font-light',
                  )
                "
                :href="item.href"
                rel="noopener noreferrer"
                target="_blank"
              >
                {{ item.name }}
              </a>
              <p className="text-muted-foreground font-light">
                {{ item.date }}
              </p>
            </li>
          </ul>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
