<script setup lang="ts">
const isProd = import.meta.env.PROD;
</script>

<template>
  <div
    v-if="!isProd"
    class="fixed right-1 bottom-1 z-50 flex size-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white"
  >
    <div class="block sm:hidden">xs</div>
    <div class="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</div>
    <div class="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
    <div class="hidden lg:block xl:hidden 2xl:hidden">lg</div>
    <div class="hidden xl:block 2xl:hidden">xl</div>
    <div class="hidden 2xl:block">2xl</div>
  </div>
</template>
