'use client';
import useSWR from 'swr';
import { useEffect } from 'react';
import { supabaseBrowser } from "@/lib/supabase/browser"

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useAdminUsers() {
    const { data, error, isLoading, mutate } = useSWR(
        '/api/admin/users',
        fetcher,
        {
            refreshInterval: 15000,     // poll ทุก 15s (กันพลาด)
            revalidateOnFocus: true,
        }
    );

    useEffect(() => {
        const supabase = supabaseBrowser();

        const channel = supabase
            .channel('admin-live')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => mutate())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'survey_sessions' }, () => mutate())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'survey_section5' }, () => mutate())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [mutate]);

    return { data, error, isLoading, mutate };
}
