<script lang="ts" setup>
import { Badge } from '@/components/ui/badge';
import { sortReleases } from '@/lib/formatters';
import { useNewReleases } from '@/lib/use-data';
import { cn } from '@/lib/utils';

const { data } = useNewReleases();
const releases = data?.value?.releases ?? {};
</script>

<template>
  <div class="space-y-4">
    <!-- <AddReleaseModal /> -->
    <div class="space-y-8">
      <div v-for="[date, items] in Object.entries(releases).sort(sortReleases)" :key="date">
        <h2
          class="flex items-center gap-2 rounded-md bg-accent px-3 py-2 font-semibold text-xl tracking-tight"
        >
          {{ date }}
          <Badge class="bg-background" variant="outline">
            {{ items.length.toLocaleString() }}
          </Badge>
        </h2>
        <ul class="text-sm" v-for="(item, index) in items" :key="item.id">
          <li
            :class="
              cn(
                'grid grid-cols-2 gap-2 p-3 sm:grid-cols-[1fr_2fr]',
                index < items.length - 1 && 'border-b',
              )
            "
          >
            <span class="text-muted-foreground">{{ item.artist }}</span>
            <span class="flex items-center gap-2">
              {{ item.title }}
              <!-- <ReleaseActions release="{r}" /> -->
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
