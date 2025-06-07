import { createRouter, createWebHistory } from 'vue-router';
import { mutate } from 'swrv';

import { ROUTE_HREF } from '@/lib/constants';
import {
  getAllTimeRankings,
  getArtists,
  getFavorites,
  getReleases,
  getSongs,
} from '@/supabase/data';
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
      beforeEnter: async (to, from, next) => {
        const key = ROUTE_HREF.TOP_ALBUMS;
        let data = cache.get(key);

        if (!data) {
          data = await getFavorites();
          cache.set(key, data);
          mutate(key, data);
        }

        to.meta.count = data.count;
        to.meta.title = 'Top albums';
        next();
      },
      component: () => import('@/views/TopAlbums.vue'),
      name: 'top-albums',
      path: ROUTE_HREF.TOP_ALBUMS,
    },
    {
      beforeEnter: async (to, from, next) => {
        const key = ROUTE_HREF.ALL_TIME;
        let data = cache.get(key);

        if (!data) {
          data = await getAllTimeRankings();
          cache.set(key, data);
          mutate(key, data);
        }

        to.meta.count = data.count;
        to.meta.title = 'All-time';
        next();
      },
      component: () => import('@/views/AllTime.vue'),
      name: 'all-time',
      path: ROUTE_HREF.ALL_TIME,
    },
    {
      beforeEnter: async (to, from, next) => {
        const key = ROUTE_HREF.FEATURED_SONGS;
        let data = cache.get(key);

        if (!data) {
          data = await getSongs();
          cache.set(key, data);
          mutate(key, data);
        }

        to.meta.count = data.count;
        to.meta.title = 'Featured songs';
        next();
      },
      component: () => import('@/views/FeaturedSongs.vue'),
      name: 'featured-songs',
      path: ROUTE_HREF.FEATURED_SONGS,
    },
    {
      beforeEnter: async (to, from, next) => {
        const key = ROUTE_HREF.NEW_RELEASES;
        let data = cache.get(key);

        if (!data) {
          data = await getReleases();
          cache.set(key, data);
          mutate(key, data);
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
      beforeEnter: async (to, from, next) => {
        const key = ROUTE_HREF.ARTISTS;
        let data = cache.get(key);

        if (!data) {
          data = await getArtists();
          cache.set(key, data);
          mutate(key, data);
        }

        to.meta.count = data.count;
        to.meta.title = 'Artists';
        next();
      },
      component: () => import('@/views/Artists.vue'),
      name: 'artists',
      path: ROUTE_HREF.ARTISTS,
    },
    {
      beforeEnter: async (to, from, next) => {
        to.meta.title = 'Sign in';
        next();
      },
      component: () => import('@/views/Signin.vue'),
      name: 'signin',
      path: ROUTE_HREF.SIGNIN,
    },
    {
      component: () => import('@/views/NotFound.vue'),
      name: 'not-found',
      path: ROUTE_HREF.NOT_FOUND,
    },
  ],
});

export default router;
