<script setup lang="ts">
import { reactive } from 'vue';
import { EllipsisVertical, Pencil, Trash } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Song } from '@/lib/types';
import DeleteSongModal from './DeleteSongModal.vue';
import EditSongModal from './EditSongModal.vue';

interface ModalState {
  open: boolean;
  type: 'edit' | 'delete';
}

const { song } = defineProps<{
  song: Song;
}>();
const modal = reactive<ModalState>({
  open: false,
  type: 'edit',
});

function setOpen(value: boolean) {
  modal.open = value;
}
</script>

<template>
  <Dialog :open="modal.open" @update:open="setOpen">
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
        <DialogTrigger asChild @click="modal.type = 'edit'">
          <DropdownMenuItem class="flex items-center gap-2">
            <Pencil class="size-4" />
            Edit
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogTrigger asChild @click="modal.type = 'delete'">
          <DropdownMenuItem class="flex items-center gap-2">
            <Trash class="size-4" />
            Delete
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
    <EditSongModal v-if="modal.type === 'edit'" :song="song" @close="modal.open = false" />
    <DeleteSongModal v-if="modal.type === 'delete'" :song="song" @close="modal.open = false" />
  </Dialog>
</template>
