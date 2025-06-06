<script setup lang="ts">
import { Button } from '@/components/ui/button';

import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="p-4 space-y-2">
    <h1 class="text-xl font-semibold">Home</h1>
    <Button @click="count++" variant="default"> Count: {{ count }} </Button>
  </div>
</template>
