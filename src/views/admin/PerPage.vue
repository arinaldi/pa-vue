<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AcceptableValue } from 'reka-ui';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PER_PAGE } from '@/lib/constants';

const { SMALL, MEDIUM, LARGE } = PER_PAGE;
const route = useRoute();
const router = useRouter();
const perPage = ref(SMALL);

function onUpdate(value: AcceptableValue) {
  if (typeof value !== 'number') return;

  perPage.value = value;
  router.push({
    query: {
      ...route.query,
      page: '1',
      perPage: value.toString(),
    },
  });
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <p class="text-sm font-medium">Rows per page</p>
    <Select @update:model-value="onUpdate" :model-value="perPage">
      <SelectTrigger class="h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent side="top">
        <SelectItem :value="SMALL">{{ SMALL }}</SelectItem>
        <SelectItem :value="MEDIUM">{{ MEDIUM }}</SelectItem>
        <SelectItem :value="LARGE">{{ LARGE }}</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
