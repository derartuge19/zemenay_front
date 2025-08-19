import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export function createClient() {
  return createServerComponentClient({
    cookies,
    options: {
      cookie: {
        name: 'sb-auth-token',
      },
    },
  });
}
