import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client instance for use in the browser.
 *
 * This function initializes a Supabase client using the public URL and
 * anonymous key provided in the environment variables. It is intended
 * for use in client-side code where SSR is not required.
 *
 * @returns {ReturnType<typeof createBrowserClient>} A Supabase client instance.
 *
 * @example
 * ```ts
 * const supabase = createClient();
 * const { data, error } = await supabase.from('events').select('*');
 * ```
 */
export function createClient(): ReturnType<typeof createBrowserClient> {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}