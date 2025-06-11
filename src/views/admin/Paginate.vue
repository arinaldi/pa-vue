<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { PER_PAGE } from '@/lib/constants';
import PerPage from './PerPage.vue';

const props = defineProps<{
  total: number;
}>();
const route = useRoute();
const router = useRouter();
const page = ref(1);
const perPage = ref(PER_PAGE.SMALL);
const lastPage = computed(() => Math.ceil(props.total / perPage.value));
const isFirstPage = computed(() => page.value === 1);
const isLastPage = computed(() => page.value === lastPage.value);

watch(() => route.query, setQuery, { immediate: true });

function setQuery(query: LocationQuery) {
  page.value = typeof query.page === 'string' ? parseInt(query.page, 10) : 1;
  perPage.value = typeof query.perPage === 'string' ? parseInt(query.perPage, 10) : PER_PAGE.SMALL;
}

function goToPage(value: number) {
  page.value = value;
  router.push({
    query: {
      ...route.query,
      page: value.toString(),
    },
  });
}
</script>

<template>
  <!-- Desktop version -->
  <div class="mt-4 hidden sm:flex sm:items-center sm:justify-end">
    <div class="flex items-center gap-10">
      <PerPage />
      <p class="font-medium text-sm">
        Page {{ page.toLocaleString() }} of {{ lastPage.toLocaleString() }}
      </p>
      <div class="flex items-center gap-2">
        <Button @click="goToPage(1)" :disabled="isFirstPage" size="icon" variant="outline">
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft class="size-4" />
        </Button>
        <Button @click="goToPage(page - 1)" :disabled="isFirstPage" size="icon" variant="outline">
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="size-4" />
        </Button>
        <Button @click="goToPage(page + 1)" :disabled="isLastPage" size="icon" variant="outline">
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="size-4" />
        </Button>
        <Button @click="goToPage(lastPage)" :disabled="isLastPage" size="icon" variant="outline">
          <span class="sr-only">Go to last page</span>
          <ChevronsRight class="size-4" />
        </Button>
      </div>
    </div>
  </div>
  <!-- Mobile version -->
  <div class="mt-4 flex flex-col gap-4 sm:hidden">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <Button @click="goToPage(page - 1)" :disabled="isFirstPage" size="icon" variant="outline">
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft class="size-4" />
        </Button>
        <Button @click="goToPage(page + 1)" :disabled="isLastPage" size="icon" variant="outline">
          <span class="sr-only">Go to next page</span>
          <ChevronRight class="size-4" />
        </Button>
      </div>
      <p class="font-medium text-sm">
        Page {{ page.toLocaleString() }} of {{ lastPage.toLocaleString() }}
      </p>
    </div>
  </div>
</template>
