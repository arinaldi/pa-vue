<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { Route } from '@/lib/types';

const { route } = defineProps<{
  route: Route;
}>();
const { setOpenMobile } = useSidebar();
const currentRoute = useRoute();
const pathMatch = computed(() => currentRoute.path === route.href);
const active = computed(() =>
  route.items ? pathMatch.value : currentRoute.path.startsWith(route.href),
);
const RouteIcon = route.icon;

function closeMobile() {
  setOpenMobile(false);
}
</script>

<template>
  <SidebarMenuItem>
    <SidebarMenuButton as-child :is-active="active">
      <RouterLink
        active-class="font-medium"
        class="text-muted-foreground"
        @click="closeMobile"
        :to="route.href"
      >
        <RouteIcon />
        {{ route.label }}
      </RouterLink>
    </SidebarMenuButton>
    <SidebarMenuSub v-if="route.items?.length">
      <SidebarMenuSubItem v-for="item in route.items" :key="item.label">
        <SidebarMenuSubButton as-child :is-active="currentRoute.path.startsWith(item.href)">
          <RouterLink @click="closeMobile" :to="item.href">
            <span
              :class="
                cn(
                  currentRoute.path.startsWith(item.href) ? 'font-medium' : 'text-muted-foreground',
                )
              "
              >{{ item.label }}</span
            >
          </RouterLink>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    </SidebarMenuSub>
  </SidebarMenuItem>
</template>
