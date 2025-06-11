<script lang="ts" setup>
import { LoaderCircle } from 'lucide-vue-next';

import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <LoaderCircle :class="cn('inline-block size-6 animate-spin duration-500', props.class)" />
</template>
