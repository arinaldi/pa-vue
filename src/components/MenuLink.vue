<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  // useSidebar,
} from '@/components/ui/sidebar';
// import { cn } from '@/lib/utils';
import type { Route } from '@/lib/types';

const props = defineProps<{
  route: Route;
}>();

const currentRoute = useRoute();
const pathMatch = computed(() => currentRoute.path === props.route.href);
const active = computed(() =>
  props.route.items ? pathMatch.value : currentRoute.path.startsWith(props.route.href),
);
// const parentActive = computed(() => (props.route.items ? pathMatch.value : true));
</script>

<template>
  <SidebarMenuItem>
    <SidebarMenuButton as-child :is-active="active">
      <RouterLink active-class="font-medium" class="text-muted-foreground" :to="route.href">{{
        route.label
      }}</RouterLink>
    </SidebarMenuButton>
    <SidebarMenuSub v-if="route.items?.length">
      <SidebarMenuSubItem v-for="item in route.items" :key="item.label">
        <SidebarMenuSubButton as-child :is-active="currentRoute.path.startsWith(item.href)">
          <RouterLink active-class="font-medium" class="text-muted-foreground" :to="item.href">
            {{ item.label }}
          </RouterLink>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </SidebarMenuItem>
</template>
