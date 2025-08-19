<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton.vue';
import { MESSAGES, ROUTES_ADMIN } from '@/lib/constants';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { albumSchema, type AlbumInput } from './schema';
import DeleteAlbumModal from './DeleteAlbumModal.vue';

const route = useRoute();
const router = useRouter();
const albumId = route.params.id as string;
const { album } = route.meta;

if (!album) {
  throw new Error(MESSAGES.INVALID_DATA);
}

const form = useForm({
  initialValues: {
    ...album,
    year: Number(album.year),
  },
  validationSchema: albumSchema,
});
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      router.push({
        path: ROUTES_ADMIN.base.href,
        query: route.query,
      });
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ year, ...rest }: AlbumInput) => {
    const id = Number.parseInt(albumId);

    if (album.favorite && !rest.favorite) {
      const { data: ranking, error: rankingError } = await supabase
        .from('rankings')
        .select('*')
        .eq('album_id', id)
        .single();

      if (rankingError) {
        throw new Error(rankingError.message);
      }

      if (ranking) {
        await supabase.from('rankings').delete().eq('id', ranking.id);
      }
    }

    const { error } = await supabase
      .from('albums')
      .update({
        ...rest,
        year: year.toString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.ALBUM_PREFIX} edited`,
});
</script>

<template>
  <div class="max-w-sm">
    <form class="space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="artist">
        <FormItem>
          <FormLabel>Artist</FormLabel>
          <FormControl>
            <Input autofocus v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="year">
        <FormItem>
          <FormLabel>Year</FormLabel>
          <FormControl>
            <Input inputmode="numeric" type="number" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ handleChange, value }" name="studio">
        <FormItem class="flex space-y-0 gap-x-3">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>Studio</FormLabel>
            <FormDescription>Is this a studio album?</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ handleChange, value }" name="cd">
        <FormItem class="flex space-y-0 gap-x-3">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>CD</FormLabel>
            <FormDescription>Do you own this CD?</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ handleChange, value }" name="wishlist">
        <FormItem class="flex space-y-0 gap-x-3">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>Wishlist</FormLabel>
            <FormDescription>Is this CD on your wishlist?</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ handleChange, value }" name="favorite" type="checkbox">
        <FormItem class="flex space-y-0 gap-x-3">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>Favorite</FormLabel>
            <FormDescription>Is this a top album?</FormDescription>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>
      <SubmitButton class="w-full sm:w-auto" :submitting="submitting">Save</SubmitButton>
    </form>
    <DeleteAlbumModal :album="album" class="mt-2 w-full sm:w-auto" />
  </div>
</template>
