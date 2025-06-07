import type { InjectionKey, Ref } from 'vue';
import { type Session } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(value: string) {
  return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`;
}

export async function wait(ms = 0) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();

    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

export const sessionKey = Symbol() as InjectionKey<Ref<Session | null>>;
