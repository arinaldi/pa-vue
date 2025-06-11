<script lang="ts" setup>
import { Button, type ButtonProps, type ButtonVariants } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import Spinner from '@/components/Spinner.vue';
import { cn } from '@/lib/utils';

interface Props extends ButtonProps {
  class?: string;
  submitting?: boolean;
  variant?: ButtonVariants['variant'];
}

const props = defineProps<Props>();
const { isMobile } = useSidebar();
</script>

<template>
  <Button
    :class="cn(props.class, 'relative')"
    :disabled="props.submitting"
    :size="isMobile ? 'lg' : 'default'"
    type="submit"
    :variant="props.variant || 'default'"
  >
    <span v-if="submitting" class="absolute inset-0 flex items-center justify-center">
      <Spinner class="size-4" />
    </span>
    <span :class="cn(submitting && 'invisible', 'flex items-center gap-2')">
      <slot />
    </span>
  </Button>
</template>
