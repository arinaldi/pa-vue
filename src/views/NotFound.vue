<script setup lang="ts">
import { Link2Off } from 'lucide-vue-next';
</script>

<template>
  <div className="max-w-sm">
    <div
      className="flex w-full flex-col items-center justify-center rounded-md border border-dashed p-6 text-center sm:w-auto sm:min-w-[400px]"
    >
      <Link2Off className="size-10 text-muted-foreground" />
      <h1 className="mt-4 font-semibold text-4xl">404</h1>
      <p className="mt-2 text-base text-muted-foreground">Page not found</p>
    </div>
  </div>
</template>
