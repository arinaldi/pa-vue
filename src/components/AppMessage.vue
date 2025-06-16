<script lang="ts" setup>
import { CircleX, Info } from 'lucide-vue-next';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MESSAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Icon } from '@/lib/types';

type Variant = 'default' | 'destructive';

const {
  className = '',
  description = MESSAGES.ERROR,
  title = 'Error',
  variant = 'destructive',
} = defineProps<{
  className?: string;
  description?: string;
  title?: string;
  variant?: Variant;
}>();
const icons: Record<Variant, Icon> = {
  default: Info,
  destructive: CircleX,
};
const IconComponent = icons[variant];
</script>

<template>
  <Alert :class="cn('max-w-fit', className)" :variant="variant">
    <IconComponent aria-hidden="true" class="size-4" />
    <AlertTitle>{{ title }}</AlertTitle>
    <AlertDescription>{{ description }}</AlertDescription>
  </Alert>
</template>
