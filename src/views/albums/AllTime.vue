<script lang="ts" setup>
import { RouterLink } from 'vue-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TopLink from '@/components/TopLink.vue';
import { ROUTE_HREF, SPOTIFY_URL } from '@/lib/constants';
import { useAllTimeRankings } from '@/lib/use-data';
import { useSession } from '@/lib/use-session';
import { cn } from '@/lib/utils';

const session = useSession();
const { data } = useAllTimeRankings();
const favorites = data?.value?.favorites ?? [];
</script>

<template>
  <div class="space-y-4 max-w-md" id="top">
    <RouterLink class="block" :to="ROUTE_HREF.ALL_TIME_EDIT">
      <Button v-if="session">Edit</Button>
    </RouterLink>
    <Card>
      <CardContent>
        <ol class="ml-4 list-decimal">
          <li
            v-for="(item, index) in favorites"
            :key="item.id"
            :class="cn('text-sm text-muted-foreground', index > 0 && 'mt-1')"
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
            <Separator v-if="(index + 1) % 10 === 0 && favorites[index + 1]" class="my-4" />
          </li>
        </ol>
      </CardContent>
    </Card>
  </div>
  <TopLink />
</template>
