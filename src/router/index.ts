import { createRouter, createWebHistory } from 'vue-router';
import { mutate } from 'swrv';

import { ROUTE_HREF, ROUTES_ADMIN } from '@/lib/constants';
import {
  getAllTimeRankings,
  getArtists,
  getFavorites,
  getReleases,
  getSongs,
} from '@/supabase/data';
import Home from '@/views/Home.vue';
import { supabase } from '@/supabase/client';

interface Data {
  count: number;
  [key: string]: unknown;
}

async function validateSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { name: 'not-found' };
  }

  return null;
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
        setTitle('Top albums');
        next();
      },
      component: () => import('@/views/albums/TopAlbums.vue'),
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
        setTitle('All-time');
        next();
      },
      component: () => import('@/views/albums/AllTime.vue'),
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
        setTitle('Featured songs');
        next();
      },
      component: () => import('@/views/songs/FeaturedSongs.vue'),
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
        setTitle('New releases');
        next();
      },
      component: () => import('@/views/releases/NewReleases.vue'),
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
        setTitle('Artists');
        next();
      },
      component: () => import('@/views/artists/Artists.vue'),
      name: 'artists',
      path: ROUTE_HREF.ARTISTS,
    },
    {
      beforeEnter: (to, from, next) => {
        to.meta.title = 'Sign in';
        setTitle('Sign in');
        next();
      },
      component: () => import('@/views/signin/Signin.vue'),
      name: 'signin',
      path: ROUTE_HREF.SIGNIN,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        to.meta.title = 'Admin';
        setTitle('Admin');
        next();
      },
      component: () => import('@/views/admin/Admin.vue'),
      name: 'admin',
      path: ROUTES_ADMIN.base.href,
    },
    {
      component: () => import('@/views/NotFound.vue'),
      name: 'not-found',
      path: ROUTE_HREF.NOT_FOUND,
    },
  ],
});

export default router;

function setTitle(value: string) {
  document.title = `${value} | Perfect Albums`;
}
