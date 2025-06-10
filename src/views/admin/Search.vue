<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { useDebounceFn } from '@vueuse/core';

import InputClearButton from '@/components/InputClearButton.vue';
import InputSpinner from '@/components/InputSpinner.vue';
import { Input } from '@/components/ui/input';
import { DEBOUNCE_IN_MS, SORT_VALUE } from '@/lib/constants';

const route = useRoute();
const router = useRouter();
const input = ref();
const searching = ref(false);
const defaultSearch = ref('');

watch(() => route.query.search, setSearch, { immediate: true });

function setSearch(search: LocationQuery['search']) {
  if (typeof search !== 'string') return;

  defaultSearch.value = search;
}

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  router.push({
    query: {
      ...route.query,
      page: '1',
      search: value || undefined,
      sort: value ? SORT_VALUE.YEAR : undefined,
    },
  });
}

const debouncedSearch = useDebounceFn(onSearch, DEBOUNCE_IN_MS);

function onClear() {
  router.push({
    query: {
      ...route.query,
      page: '1',
      search: undefined,
      sort: undefined,
    },
  });

  if (input.value?.$el) {
    input.value.$el.value = '';
    input.value?.$el.focus();
  }
}
</script>

<template>
  <div class="relative">
    <Input
      autofocus
      :default-value="defaultSearch"
      @input="debouncedSearch"
      name="search"
      placeholder="Search"
      ref="input"
    />
    <InputClearButton v-if="!searching && defaultSearch" @click="onClear" />
    <InputSpinner v-if="searching" />
  </div>
</template>
