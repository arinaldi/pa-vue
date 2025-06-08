<script lang="ts" setup>
import { HEADER_LETTERS } from '@/lib/formatters';
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <template v-for="(letter, index) in HEADER_LETTERS" :key="letter">
      <a
        class="hover:text-muted-foreground underline underline-offset-4"
        :href="`#letter-${letter}`"
      >
        {{ letter }}
      </a>
      <span v-if="index < HEADER_LETTERS.length - 1">&middot;</span>
    </template>
  </div>
</template>
