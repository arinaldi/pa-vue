<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue';

import AppMessage from '@/components/AppMessage.vue';

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err;
  return false;
});

function clearError() {
  error.value = null;
}

const slotProps = computed(() => {
  if (!error.value) return {};
  return { error, clearError };
});

const slotName = computed(() => (error.value ? 'error' : 'default'));
</script>

<template>
  <AppMessage v-if="error" :description="error.message" />
  <slot v-else :name="slotName" v-bind="slotProps" />
</template>
