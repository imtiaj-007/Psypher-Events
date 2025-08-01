import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { auth } from '@clerk/nextjs/server'


export async function createClient() {
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
                getAll() {
                    return cookieStore.getAll()
                },
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