<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { Pencil } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DecadeLink from '@/views/albums/DecadeLink.vue';
import TopLink from '@/components/TopLink.vue';
import { ROUTE_HREF, SPOTIFY_URL } from '@/lib/constants';
import { useTopAlbums } from '@/lib/use-data';
import { useSession } from '@/lib/use-session';

const session = useSession();
const { data } = useTopAlbums();
const favorites = data?.value?.favorites ?? {};
</script>

<template>
  <div class="space-y-4" id="top">
    <DecadeLink />
    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4">
      <template
        v-for="[year, items] in Object.entries(favorites).sort(
          (a, b) => Number(b[0]) - Number(a[0]),
        )"
        :key="year"
      >
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="flex items-center gap-2" :id="year">
                {{ year }}
                <Badge variant="secondary">
                  {{ items.length.toLocaleString() }}
                </Badge>
              </CardTitle>
              <RouterLink v-if="session" :to="ROUTE_HREF.EDIT_RANKINGS.replace(':year', year)">
                <Button size="icon" variant="outline">
                  <Pencil class="size-4" />
                </Button>
              </RouterLink>
            </div>
          </CardHeader>
          <CardContent>
            <ol class="ml-4 list-decimal space-y-1">
              <li
                class="text-muted-foreground text-sm"
                v-for="item in items.sort((a, b) => {
                  if (a.ranking > b.ranking) return 1;
                  if (a.ranking < b.ranking) return -1;
                  return 0;
                })"
                :key="item.id"
              >
                <span>{{ item.artist }} &ndash;</span>{{ ' ' }}
                <a
                  class="text-foreground hover:text-muted-foreground underline underline-offset-4"
                  :href="`${SPOTIFY_URL}/${encodeURI(`${item.artist} ${item.title}`)}`"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {{ item.title }}
                </a>
              </li>
            </ol>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
  <TopLink />
</template>
