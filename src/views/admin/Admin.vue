<script lang="ts" setup>
import { ref, watch } from 'vue';
import { RouterLink, useRoute, type LocationQuery } from 'vue-router';
import { Check, ChevronRight, Disc, HeartPlus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataEmptyPlaceholder from '@/components/DataEmptyPlaceholder.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MESSAGES, ROUTES_ADMIN } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getAdminData } from '@/supabase/data';
import AlbumActions from './AlbumActions.vue';
import FacetedFilter from './FacetedFilter.vue';
import Paginate from './Paginate.vue';
import ResetFilters from './ResetFilters.vue';
import Search from './Search.vue';
import SortableColumn from './SortableColumn.vue';

const version = __APP_VERSION__;
const route = useRoute();
const loading = ref(false);
const data = ref<Awaited<ReturnType<typeof getAdminData>>>({
  albums: [],
  cdCount: 0,
  count: 0,
});

watch(() => route.query, getData, { immediate: true });

async function getData(adminParams: LocationQuery) {
  try {
    loading.value = true;
    data.value = await getAdminData(adminParams);
  } catch (error) {
    const message = error instanceof Error ? error.message : MESSAGES.ERROR;
    toast.error(message);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <RouterLink
      :to="{
        path: ROUTES_ADMIN.add.href,
        query: route.query,
      }"
    >
      <Button type="button">Add album</Button>
    </RouterLink>
    <div class="flex items-center gap-4 text-xs dark:text-white">
      <span class="flex items-center gap-0.5">
        <Badge variant="secondary">{{ data.count.toLocaleString() }}</Badge>
        <span class="leading-7"> result{{ data.count === 1 ? '' : 's' }} </span>
      </span>
      <code>v{{ version }}</code>
      <span class="flex items-center gap-0.5">
        <Badge variant="secondary">{{ data.cdCount.toLocaleString() }}</Badge>
        <span class="leading-7"> CD{{ data.cdCount === 1 ? '' : 's' }} </span>
      </span>
    </div>
  </div>
  <div class="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
    <Search :searching="loading" />
    <div class="flex flex-wrap items-center gap-2">
      <FacetedFilter queryKey="cd" title="CD" />
      <FacetedFilter queryKey="favorite" title="Favorite" />
      <FacetedFilter queryKey="studio" title="Studio" />
      <FacetedFilter queryKey="wishlist" title="Wishlist" />
      <ResetFilters :queryKeys="['cd', 'favorite', 'studio', 'wishlist']" />
    </div>
  </div>

  <div v-if="data.albums.length === 0 && !loading" class="mt-4 flex justify-center">
    <DataEmptyPlaceholder />
  </div>
  <template v-if="data.albums && data.albums.length > 0">
    <div class="mt-4 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow class="text-xs">
            <SortableColumn prop="artist">Artist</SortableColumn>
            <SortableColumn prop="year">Year</SortableColumn>
            <SortableColumn prop="title">Title</SortableColumn>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="album in data.albums" :key="album.id">
            <TableCell>{{ album.artist }}</TableCell>
            <TableCell>{{ album.year }}</TableCell>
            <TableCell>
              <Disc v-if="album.cd" class="text-muted-foreground mr-1 mb-0.5 inline size-4" />
              <HeartPlus
                v-if="album.wishlist"
                class="text-muted-foreground mr-1 mb-0.5 inline size-4"
              />
              <span
                :class="cn(album.studio ? 'font-medium' : 'font-light', album.favorite && 'italic')"
              >
                {{ album.title }}
              </span>
              <Check
                v-if="album.favorite"
                class="text-muted-foreground mb-0.5 ml-1 inline size-4"
              />
            </TableCell>
            <TableCell class="flex items-center justify-end gap-2">
              <AlbumActions :album="album" />
              <Button asChild class="size-8 p-0" variant="ghost">
                <RouterLink
                  :to="{
                    path: ROUTES_ADMIN.edit.href.replace(':id', album.id.toString()),
                    query: route.query,
                  }"
                >
                  <ChevronRight class="size-4" />
                </RouterLink>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <Paginate :total="data.count" />
  </template>
</template>
