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
import type { Release } from '@/lib/types';
import DeleteReleaseModal from './DeleteReleaseModal.vue';
import EditReleaseModal from './EditReleaseModal.vue';

interface ModalState {
  open: boolean;
  type: 'edit' | 'delete';
}

const props = defineProps<{
  release: Release;
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
    <EditReleaseModal
      v-if="modal.type === 'edit'"
      :release="props.release"
      @close="modal.open = false"
    />
    <DeleteReleaseModal
      v-if="modal.type === 'delete'"
      :release="props.release"
      @close="modal.open = false"
    />
  </Dialog>
</template>
