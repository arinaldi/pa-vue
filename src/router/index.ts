import { createRouter, createWebHistory } from 'vue-router';
import { mutate } from 'swrv';

import { ROUTE_HREF, ROUTES_ADMIN } from '@/lib/constants';
import type { Album } from '@/lib/types';
import {
  getAlbum,
  getAllTimeRankings,
  getArtists,
  getFavorites,
  getRankingsByYear,
  getReleases,
  getSongs,
} from '@/supabase/data';
import Home from '@/views/Home.vue';
import { supabase } from '@/supabase/client';
import type { AllTimeListItem } from '@/lib/formatters';

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
      meta: { title: 'Home' },
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
        next();
      },
      component: () => import('@/views/albums/TopAlbums.vue'),
      meta: { title: 'Top albums' },
      name: 'top-albums',
      path: ROUTE_HREF.TOP_ALBUMS,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        const { count, favorites } = await getRankingsByYear(to.params.year as string);

        to.meta.count = count;
        to.meta.favorites = favorites;
        next();
      },
      component: () => import('@/views/albums/EditRankings.vue'),
      meta: { title: 'Edit rankings' },
      name: 'edit-rankings',
      path: ROUTE_HREF.EDIT_RANKINGS,
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
        next();
      },
      component: () => import('@/views/albums/AllTime.vue'),
      meta: { title: 'All-time' },
      name: 'all-time',
      path: ROUTE_HREF.ALL_TIME,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        const { count, favorites } = await getAllTimeRankings();

        to.meta.count = count;
        to.meta.favorites = favorites;
        next();
      },
      component: () => import('@/views/albums/EditAllTimeRankings.vue'),
      meta: { title: 'Edit all-time' },
      name: 'edit-all-time',
      path: ROUTE_HREF.ALL_TIME_EDIT,
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
        next();
      },
      component: () => import('@/views/songs/FeaturedSongs.vue'),
      meta: { title: 'Featured songs' },
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
        next();
      },
      component: () => import('@/views/releases/NewReleases.vue'),
      meta: { title: 'New releases' },
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
        next();
      },
      component: () => import('@/views/artists/Artists.vue'),
      meta: { title: 'Artists' },
      name: 'artists',
      path: ROUTE_HREF.ARTISTS,
    },
    {
      component: () => import('@/views/playlist/Playlist.vue'),
      meta: { title: 'Playlist' },
      name: 'playlist',
      path: ROUTE_HREF.PLAYLIST,
    },
    {
      component: () => import('@/views/signin/Signin.vue'),
      meta: { title: 'Sign in' },
      name: 'signin',
      path: ROUTE_HREF.SIGNIN,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        next();
      },
      component: () => import('@/views/admin/Admin.vue'),
      meta: { title: 'Admin' },
      name: 'admin',
      path: ROUTES_ADMIN.base.href,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        next();
      },
      component: () => import('@/views/admin/AddAlbum.vue'),
      meta: { title: 'Add album' },
      name: 'add-album',
      path: ROUTES_ADMIN.add.href,
    },
    {
      beforeEnter: async (to, from, next) => {
        const result = await validateSession();

        if (result) {
          return next(result);
        }

        const { album } = await getAlbum(to.params.id as string);

        to.meta.album = album;
        next();
      },
      component: () => import('@/views/admin/EditAlbum.vue'),
      meta: { title: 'Edit album' },
      name: 'edit-album',
      path: ROUTES_ADMIN.edit.href,
    },
    {
      component: () => import('@/views/NotFound.vue'),
      meta: { title: 'Not found' },
      name: 'not-found',
      path: ROUTE_HREF.NOT_FOUND,
    },
  ],
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Perfect Albums`;
  next();
});

export default router;

declare module 'vue-router' {
  interface RouteMeta {
    album?: Album;
    count?: number;
    favorites?: AllTimeListItem[];
    title: string;
  }
}
