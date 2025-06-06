import type { FunctionalComponent } from 'vue';
import type { LucideProps } from 'lucide-vue-next';

import type { Database } from '@/supabase/db-types';

export type Album = Database['public']['Tables']['albums']['Row'];
export type Ranking = Database['public']['Tables']['rankings']['Row'];
export type Release = Database['public']['Tables']['releases']['Row'];
export type Song = Database['public']['Tables']['songs']['Row'];

export type Callback = () => void;

export interface ErrorProps {
  error: Error;
  reset: () => void;
}

// eslint-disable-next-line
export type Icon = FunctionalComponent<LucideProps, {}, any, {}>;

interface SuccessResult {
  data: unknown;
  type: 'success';
}

interface ErrorResult {
  message: string;
  type: 'error';
}

export type MutateResult = SuccessResult | ErrorResult;

export interface Route {
  href: string;
  icon: Icon;
  label: string;
  items?: {
    href: string;
    label: string;
  }[];
}
