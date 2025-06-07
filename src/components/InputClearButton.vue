<script lang="ts" setup>
import { X } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';

const emit = defineEmits<{
  clear: [];
}>();

function onClear() {
  emit('clear');
}
</script>

<template>
  <div class="absolute top-0 right-0.5 flex h-full items-center">
    <Button class="size-8" @click="onClear" size="icon" variant="ghost">
      <X class="size-4" />
    </Button>
  </div>
</template>
