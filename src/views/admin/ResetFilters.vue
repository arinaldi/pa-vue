<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { X } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';

const { queryKeys } = defineProps<{
  queryKeys: string[];
}>();
const route = useRoute();
const router = useRouter();
const show = computed(() => queryKeys.some((qk) => qk in route.query));

function onClick() {
  const newQuery = { ...route.query };

  queryKeys.forEach((qk) => {
    delete newQuery[qk];
  });

  router.push({
    query: {
      ...newQuery,
      page: '1',
    },
  });
}
</script>

<template>
  <Button v-if="show" class="h-8 w-fit px-2 lg:px-3" @click="onClick" variant="ghost">
    Reset <X />
  </Button>
</template>
