<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { EllipsisVertical } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Album } from '@/lib/types';
import { useTopAlbums } from '@/lib/use-data';
import { supabase } from '@/supabase/client';

type Key = 'cd' | 'favorite' | 'studio' | 'wishlist';

const route = useRoute();
const router = useRouter();
const albumKeys: Record<Key, string> = {
  cd: 'CD',
  favorite: 'Favorite',
  studio: 'Studio',
  wishlist: 'Wishlist',
};
const { album } = defineProps<{
  album: Album;
}>();
const { mutate } = useTopAlbums();

async function onChange(key: Key, checked: boolean) {
  const { error } = await supabase
    .from('albums')
    .update({
      [key]: checked,
    })
    .eq('id', album.id);

  if (error) {
    toast.error(error.message);
  }

  await mutate();
  router.replace({
    query: {
      ...route.query,
      now: Date.now().toString(),
    },
  });
}
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger asChild>
      <Button class="size-6 shrink-0" variant="ghost">
        <span class="sr-only">Open menu</span>
        <EllipsisVertical class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="[key, value] in Object.entries(albumKeys)"
        :key="key"
        :modelValue="album[key as Key]"
        @select.prevent
        @update:modelValue="(payload) => onChange(key as Key, payload)"
      >
        {{ value }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
