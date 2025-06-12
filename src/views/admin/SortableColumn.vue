<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { ArrowDown } from 'lucide-vue-next';

import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const { prop, wrapperClassName } = defineProps<{
  prop: string;
  wrapperClassName?: string;
}>();
const route = useRoute();
const router = useRouter();
const sort = ref<string | null>('');
const sortPropRef = ref('');
const descRef = ref('');

watch(() => route.query.sort, setSort, { immediate: true });

function setSort(value: LocationQuery['sort']) {
  const [sortProp, desc] = typeof value == 'string' ? value.split(':') : [];
  let newSort: string | null = null;

  if (sortProp !== prop) {
    newSort = prop;
  } else if (sortProp === prop && !desc) {
    newSort = `${prop}:desc`;
  }

  sort.value = newSort;
  sortPropRef.value = sortProp;
  descRef.value = desc;
}

function onClick() {
  router.push({
    query: {
      ...route.query,
      sort: sort.value ?? undefined,
    },
  });
}
</script>

<template>
  <TableHead :class="cn(`cursor-pointer`, wrapperClassName)" @click="onClick" scope="col">
    <slot />
    <span :class="cn('ml-1 flex-none', sortPropRef === prop ? '' : 'invisible')">
      <ArrowDown aria-hidden="true" :class="cn('inline size-4', descRef ? 'rotate-180' : '')" />
    </span>
  </TableHead>
</template>
