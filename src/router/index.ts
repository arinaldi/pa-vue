import { createRouter, createWebHistory } from 'vue-router';

import { ROUTE_HREF } from '@/lib/constants';
import { getReleases } from '@/supabase/data';
import Home from '@/views/Home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: Home,
      name: 'home',
      path: '/',
    },
    {
      component: () => import('@/views/TopAlbums.vue'),
      name: 'top-albums',
      path: ROUTE_HREF.TOP_ALBUMS,
    },
    {
      component: () => import('@/views/AllTime.vue'),
      name: 'all-time',
      path: ROUTE_HREF.ALL_TIME,
    },
    {
      component: () => import('@/views/FeaturedSongs.vue'),
      name: 'featured-songs',
      path: ROUTE_HREF.FEATURED_SONGS,
    },
    {
      component: () => import('@/views/NewReleases.vue'),
      name: 'new-releases',
      path: ROUTE_HREF.NEW_RELEASES,
    },
    {
      component: () => import('@/views/Artists.vue'),
      name: 'artists',
      path: ROUTE_HREF.ARTISTS,
    },
    {
      component: () => import('@/views/NotFound.vue'),
      name: 'not-fount',
      path: ROUTE_HREF.NOT_FOUND,
    },
  ],
});

export default router;
