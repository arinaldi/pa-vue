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
import { typedAlbumSchema, type AlbumInput } from './schema';

const route = useRoute();
const router = useRouter();
const form = useForm({
  initialValues: {
    artist: '',
    title: '',
    year: new Date().getFullYear(),
    studio: false,
    cd: false,
    wishlist: false,
    favorite: false,
  },
  validationSchema: typedAlbumSchema,
});
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      router.push({ path: ROUTES_ADMIN.base.href, query: route.query });
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ year, ...rest }: AlbumInput) => {
    const { error } = await supabase.from('albums').insert({
      ...rest,
      year: year.toString(),
    });

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.ALBUM_PREFIX} added`,
});
</script>

<template>
  <form class="max-w-sm space-y-6" @submit="onSubmit">
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
</template>
