<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { Disc } from 'lucide-vue-next';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import MenuLink from '@/components/MenuLink.vue';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  type SidebarProps,
} from '@/components/ui/sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/components/ui/sidebar/utils';
import { ROUTES } from '@/lib/constants';
import { getCookie } from '@/lib/utils';

const props = defineProps<SidebarProps>();
const sidebarState = getCookie(SIDEBAR_COOKIE_NAME);
const defaultOpen = ref(true);

if (sidebarState) {
  defaultOpen.value = sidebarState === 'true';
}
</script>

<template>
  <SidebarProvider :defaultOpen="defaultOpen">
    <Sidebar v-bind="props" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <a href="#">
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                >
                  <Disc class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-semibold">Perfect Albums</span>
                  <span class="text-muted-foreground text-xs">The best music on the next</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <template v-for="route in ROUTES" :key="route.label">
              <MenuLink :route="route" />
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header class="flex h-12 shrink-0 items-center gap-2 border-b">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> Building Your Application </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="isolate p-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
