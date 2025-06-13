<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { Disc, Lock } from 'lucide-vue-next';

import { Badge } from '@/components/ui/badge';
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import UserMenu from '@/components/UserMenu.vue';
import { ROUTES, ROUTES_ADMIN } from '@/lib/constants';
import { useSession } from '@/lib/use-session';
import { getCookie } from '@/lib/utils';

const props = defineProps<SidebarProps>();
const route = useRoute();
const session = useSession();
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
            <SidebarMenuButton asChild class="hover:bg-transparent" size="lg">
              <div>
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <Disc class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-semibold">Perfect Albums</span>
                  <span class="text-muted-foreground text-xs">The best music on the next</span>
                </div>
              </div>
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
        <SidebarGroup v-if="session">
          <SidebarGroupLabel>Protected</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuLink
                :route="{
                  href: ROUTES_ADMIN.base.href,
                  icon: Lock,
                  label: ROUTES_ADMIN.base.label,
                }"
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
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
                <BreadcrumbLink as-child>
                  <RouterLink to="/">Home</RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <template v-if="route.meta.title">
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    <span class="flex items-center gap-2">
                      <span>{{ route.meta.title }}</span>
                      <Badge v-if="route.meta.count" variant="secondary">
                        {{ route.meta.count.toLocaleString() }}
                      </Badge>
                    </span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </template>
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
