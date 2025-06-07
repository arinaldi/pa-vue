<script setup lang="ts">
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useColorMode } from '@vueuse/core';
import { toast } from 'vue-sonner';
import { ChevronsUpDown, LogIn, LogOut, User } from 'lucide-vue-next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ROUTE_HREF, ROUTES_ADMIN } from '@/lib/constants';
import { sessionKey } from '@/lib/utils';
import { supabase } from '@/supabase/client';

const route = useRoute();
const router = useRouter();
const { isMobile, setOpenMobile } = useSidebar();
const colorMode = useColorMode();
const session = inject(sessionKey);

function signIn() {
  setOpenMobile(false);
  router.push(ROUTE_HREF.SIGNIN);
}

async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error(error.message);
    return;
  }

  if (route.path.startsWith(ROUTES_ADMIN.base.href)) {
    router.push(ROUTE_HREF.TOP_ALBUMS);
  }
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <template v-if="session">
              <Avatar class="size-8 rounded-lg">
                <AvatarImage class="bg-gray-300" src="/avatars/03.png" />
                <AvatarFallback class="rounded-lg">
                  {{
                    `${session.user.user_metadata.firstName[0]}${session.user.user_metadata.lastName[0]}`
                  }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold"> {{ session.user.user_metadata.name }} </span>
                <span class="truncate text-xs">
                  {{ session.user.email }}
                </span>
              </div>
            </template>
            <Avatar v-else class="bg-muted flex size-8 items-center justify-center rounded-lg">
              <User class="size-5" />
            </Avatar>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <template v-if="session">
            <DropdownMenuLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar class="size-8 rounded-lg">
                  <AvatarImage class="bg-gray-300" src="/avatars/03.png" />
                  <AvatarFallback class="rounded-lg">
                    {{
                      `${session.user.user_metadata.firstName[0]}${session.user.user_metadata.lastName[0]}`
                    }}
                  </AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">
                    {{ session.user.user_metadata.name }}
                  </span>
                  <span class="truncate text-xs">
                    {{ session.user.email }}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </template>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup v-model="colorMode">
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="auto">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-if="session" @select="signOut">
            <LogOut />
            Sign out
          </DropdownMenuItem>
          <DropdownMenuItem v-else @select="signIn">
            <LogIn />
            Sign in
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
