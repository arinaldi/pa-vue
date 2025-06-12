<script lang="ts" setup>
import { Reorder, useDragControls } from 'motion-v';
import { Grip } from 'lucide-vue-next';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type AllTimeListItem } from '@/lib/formatters';
import RemoveRankingModal from './RemoveRankingModal.vue';

const emit = defineEmits<{
  remove: [id: number];
}>();
const { item, position, showRemove } = defineProps<{
  item: AllTimeListItem;
  position: number;
  showRemove?: boolean;
}>();
const controls = useDragControls();
</script>

<template>
  <Reorder.Item :dragControls="controls" :dragListener="false" :id="item.id" :value="item">
    <Card class="py-0 transition-shadow has-[svg:active]:shadow-lg">
      <CardHeader class="p-4 select-none">
        <div class="flex items-start justify-between gap-2">
          <CardTitle> {{ position }}. {{ item.title }} </CardTitle>
          <Grip
            class="size-4 shrink-0 touch-none hover:cursor-grab active:cursor-grabbing"
            @pointerdown="(event) => controls.start(event)"
          />
        </div>
        <CardDescription class="flex items-center gap-0.5">
          {{ item.artist }}
          <RemoveRankingModal v-if="showRemove" :item="item" @remove="emit('remove', item.id)" />
        </CardDescription>
      </CardHeader>
    </Card>
  </Reorder.Item>
</template>
