<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core';

import { Button, type ButtonProps, type ButtonVariants } from '@/components/ui/button';
import Spinner from '@/components/Spinner.vue';
import { MOBILE_MEDIA_QUERY } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props extends ButtonProps {
  class?: string;
  submitting?: boolean;
  variant?: ButtonVariants['variant'];
}

const props = defineProps<Props>();
const mobile = useMediaQuery(MOBILE_MEDIA_QUERY);
</script>

<template>
  <Button
    :class="cn(props.class, 'relative')"
    :disabled="props.submitting"
    :size="mobile ? 'lg' : 'default'"
    type="submit"
    :variant="props.variant || 'default'"
  >
    <span v-if="submitting" class="absolute inset-0 flex items-center justify-center">
      <Spinner className="size-4" />
    </span>
    <span :class="cn(submitting && 'invisible', 'flex items-center gap-2')">
      <slot />
    </span>
  </Button>
</template>
