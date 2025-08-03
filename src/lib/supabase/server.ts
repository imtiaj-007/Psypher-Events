import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'

/**
 * Creates a Supabase server client instance for use in Next.js server components or API routes.
 *
 * This function initializes a Supabase client using the public URL and anonymous key
 * from environment variables. It attaches cookies and headers from the current request context,
 * and, if available, includes a Clerk JWT token for RLS (Row Level Security) authorization.
 *
 * @returns {Promise<ReturnType<typeof createServerClient>>} A promise that resolves to a Supabase server client instance.
 *
 * @example
 * ```ts
 * const supabase = await createClient();
 * const { data, error } = await supabase.from('events').select('*');
 * ```
 */
export async function createClient(): Promise<ReturnType<typeof createServerClient>> {
    const cookieStore = await cookies();
    const headerStore = await headers();

    let token: string | null = null;
    try {
        const { getToken } = await auth();
        token = await getToken({ template: 'supabase' });
    } catch (error) {
        console.warn('Failed to get Clerk token:', error);
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /**
                 * Retrieves all cookies from the current request context.
                 * @returns {ReturnType<typeof cookieStore.getAll>} An array of cookies.
                 */
                getAll(): ReturnType<typeof cookieStore.getAll> {
                    return cookieStore.getAll()
                },
                /**
                 * Sets multiple cookies in the current response context.
                 * @param cookiesToSet - Array of cookies to set.
                 */
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    )
                },
            },
            global: {
                headers: {
                    ...Object.fromEntries(headerStore.entries()),
                    ...(token && { Authorization: `Bearer ${token}` })
                },
            },
        }
    )
}