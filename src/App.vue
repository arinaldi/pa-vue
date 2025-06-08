<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue';
import SessionProvider from '@/components/SessionProvider.vue';
import TailwindIndicator from '@/components/TailwindIndicator.vue';
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
</script>

<template>
  <SessionProvider>
    <AppSidebar />
    <TailwindIndicator />
    <Toaster position="top-right" rich-colors />
  </SessionProvider>
</template>
