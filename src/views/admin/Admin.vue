<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, type LocationQuery } from 'vue-router';
import { Check, Disc, HeartPlus } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
// import { ROUTES_ADMIN } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getAdminData } from '@/supabase/data';
import DataEmptyPlaceholder from './DataEmptyPlaceholder.vue';
import Paginate from './Paginate.vue';
import Search from './Search.vue';
import SortableColumn from './SortableColumn.vue';

const version = import.meta.env.VITE_APP_VERSION;
const route = useRoute();
const loading = ref(false);
const data = ref<Awaited<ReturnType<typeof getAdminData>> | null>(null);

watch(() => route.query, getData, { immediate: true });

async function getData(adminParams: LocationQuery) {
  data.value = null;
  loading.value = true;

  try {
    data.value = await getAdminData(adminParams);
  } catch (error) {
    console.error('Error fetching admin data:', error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <!-- <Link search={(prev) => prev} to={ROUTES_ADMIN.add.href}>
    </Link> -->
    <Button type="button">Add album</Button>
    <div class="flex items-center gap-4 dark:text-white">
      <code class="text-xs">{{ version }}</code>
      <span class="flex items-center gap-0.5">
        <Badge variant="secondary">{{ data?.cdCount.toLocaleString() }}</Badge>
        <span class="text-sm leading-7"> CD{{ data?.cdCount === 1 ? '' : 's' }} </span>
      </span>
    </div>
  </div>
  <div class="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
    <Search />
    <div class="flex flex-wrap items-center gap-2">
      <!-- <FacetedFilter queryKey="cd" title="CD" />
          <FacetedFilter queryKey="favorite" title="Favorite" />
          <FacetedFilter queryKey="studio" title="Studio" />
          <FacetedFilter queryKey="wishlist" title="Wishlist" />
          <ResetFilters queryKeys={['cd', 'favorite', 'studio', 'wishlist']} /> -->
    </div>
  </div>

  <div v-if="data?.albums.length === 0" class="mt-4 flex justify-center">
    <DataEmptyPlaceholder />
  </div>
  <div v-if="data?.albums && data.albums.length > 0" class="mt-4 rounded-md border">
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
            <Disc v-if="album.cd" class="mr-1 mb-0.5 inline size-4 text-muted-foreground" />
            <HeartPlus
              v-if="album.wishlist"
              class="mr-1 mb-0.5 inline size-4 text-muted-foreground"
            />
            <span
              :class="cn(album.studio ? 'font-medium' : 'font-light', album.favorite && 'italic')"
            >
              {{ album.title }}
            </span>
            <Check v-if="album.favorite" class="mb-0.5 ml-1 inline size-4 text-muted-foreground" />
          </TableCell>
          <TableCell class="flex items-end justify-end gap-2">
            <!-- <AlbumActions album={a} />
            <TableLink id={a.id} /> -->
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
  <Paginate :total="data?.count ?? 0" />
</template>
