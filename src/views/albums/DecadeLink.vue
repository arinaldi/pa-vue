<script lang="ts" setup>
import { DECADES } from '@/lib/constants';
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <template v-for="(decade, index) in DECADES" :key="decade.id">
      <a class="hover:text-muted-foreground underline underline-offset-4" :href="`#${decade.id}`">
        {{ decade.label }}
      </a>
      <span v-if="index < DECADES.length - 1">&middot;</span>
    </template>
  </div>
</template>
