<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { useDebounceFn, useFocus } from '@vueuse/core';

import InputClearButton from '@/components/InputClearButton.vue';
import InputSpinner from '@/components/InputSpinner.vue';
import { Input } from '@/components/ui/input';
import { DEBOUNCE_IN_MS } from '@/lib/constants';

const { searching } = defineProps<{
  searching: boolean;
}>();
const route = useRoute();
const router = useRouter();
const inputRef = ref();
const defaultSearch = ref('');
const { focused } = useFocus(inputRef);

onMounted(() => {
  focused.value = true;
});

watch(() => route.query.search, setSearch, { immediate: true });

function setSearch(search: LocationQuery['search'] | undefined) {
  if (typeof search !== 'string') return;

  defaultSearch.value = search;
}

function onSearch(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  router.push({
    query: {
      search: value || undefined,
    },
  });
}

const debouncedSearch = useDebounceFn(onSearch, DEBOUNCE_IN_MS);

function onClear() {
  router.push({
    query: {
      search: undefined,
    },
  });

  if (inputRef.value?.$el) {
    inputRef.value.$el.value = '';
    inputRef.value?.$el.focus();
  }
}
</script>

<template>
  <div class="relative">
    <Input
      :default-value="defaultSearch"
      @input="debouncedSearch"
      name="search"
      placeholder="Search"
      ref="inputRef"
    />
    <InputClearButton v-if="!searching && defaultSearch" @click="onClear" />
    <InputSpinner v-if="searching" />
  </div>
</template>
