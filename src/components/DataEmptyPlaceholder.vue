<script lang="ts" setup>
import { Search } from 'lucide-vue-next';
</script>

<template>
  <div
    class="flex w-full items-center justify-center rounded-md border border-dashed p-6 sm:w-auto sm:min-w-80"
  >
    <div class="mx-auto flex max-w-[400px] flex-col items-center justify-center text-center">
      <Search class="text-muted-foreground size-10" />
      <h3 class="mt-4 text-lg font-semibold">No results found</h3>
      <p class="text-muted-foreground mt-2 text-sm">Modify your search query</p>
    </div>
  </div>
</template>
