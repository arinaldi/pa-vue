import { createRouter, createWebHistory } from 'vue-router';
import { mutate } from 'swrv';

import { ROUTE_HREF } from '@/lib/constants';
import { getReleases } from '@/supabase/data';
import Home from '@/views/Home.vue';

interface Data {
  count: number;
  [key: string]: unknown;
}

const cache = new Map<string, Data>();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: Home,
      name: 'home',
      path: '/',
    },
    {
      beforeEnter: (to, from, next) => {
        to.meta.title = 'Top albums';
        next();
      },
      component: () => import('@/views/TopAlbums.vue'),
      name: 'top-albums',
      path: ROUTE_HREF.TOP_ALBUMS,
    },
    {
      beforeEnter: (to, from, next) => {
        to.meta.title = 'All-time';
        next();
      },
      component: () => import('@/views/AllTime.vue'),
      name: 'all-time',
      path: ROUTE_HREF.ALL_TIME,
    },
    {
      beforeEnter: (to, from, next) => {
        to.meta.title = 'Featured songs';
        next();
      },
      component: () => import('@/views/FeaturedSongs.vue'),
      name: 'featured-songs',
      path: ROUTE_HREF.FEATURED_SONGS,
    },
    {
      beforeEnter: async (to, from, next) => {
        let data = cache.get(ROUTE_HREF.NEW_RELEASES);

        if (!data) {
          data = await getReleases();
          cache.set(ROUTE_HREF.NEW_RELEASES, data);
          mutate(ROUTE_HREF.NEW_RELEASES, data);
        }

        to.meta.count = data.count;
        to.meta.title = 'New releases';
        next();
      },
      component: () => import('@/views/NewReleases.vue'),
      name: 'new-releases',
      path: ROUTE_HREF.NEW_RELEASES,
    },
    {
      beforeEnter: (to, from, next) => {
        to.meta.title = 'Artists';
        next();
      },
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
