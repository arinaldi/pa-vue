<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import type { AcceptableValue, ListboxItemSelectEvent } from 'reka-ui';
import { Circle, CircleOff, PlusCircle } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const props = defineProps<{
  queryKey: string;
  title: string;
}>();
const route = useRoute();
const router = useRouter();
const options = [
  { label: 'Enabled', value: 'true' },
  { label: 'Disabled', value: 'false' },
];
const filter = ref((route.query[props.queryKey] as string) ?? '');
const open = ref(false);
const selectedOption = computed(() => options.find((o) => o.value === filter.value));

watch(() => route.query, setFilter, { immediate: true });

function setFilter(query: LocationQuery) {
  const newValue = query[props.queryKey];

  filter.value = typeof newValue === 'string' ? newValue : '';
}

function onSelect(event: ListboxItemSelectEvent<AcceptableValue>) {
  const value = event.detail.value as string;
  const newValue = value === 'clear' ? '' : value;

  open.value = false;
  filter.value = newValue;
  router.push({
    query: {
      ...route.query,
      page: '1',
      [props.queryKey]: value === 'clear' ? undefined : (value === 'true').toString(),
    },
  });
}
</script>

<template>
  <Popover :open="open" @update:open="(value) => (open = value)">
    <PopoverTrigger asChild>
      <Button class="justify-start border-dashed text-xs" size="sm" variant="outline">
        <PlusCircle />
        {{ title }}
        <template v-if="selectedOption">
          <Separator class="mx-1 data-[orientation=vertical]:h-4" orientation="vertical" />
          <div class="flex space-x-1">
            <Badge class="rounded-sm px-1 font-normal" variant="secondary">
              {{ selectedOption.label }}
            </Badge>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-[200px] p-0">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              @select="onSelect"
              :value="option.value"
            >
              <Circle v-if="option.value === 'true'" class="size-4 text-muted-foreground" />
              <CircleOff v-if="option.value === 'false'" class="size-4 text-muted-foreground" />
              <span :class="cn(option.value === filter.toString() && 'font-semibold')">
                {{ option.label }}
              </span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              class="justify-center"
              :disabled="typeof filter !== 'boolean'"
              @select="onSelect"
              value="clear"
            >
              Clear filter
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
