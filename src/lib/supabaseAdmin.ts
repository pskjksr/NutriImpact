import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
    // URL ใช้ตัว server เป็นหลัก ถ้ายังไม่ตั้งค่า ยอม fallback ตัว public ชั่วคราว (แค่ URL ไม่ใช่ secret)
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    // KEY แนะนำ SERVICE_ROLE_KEY (ถ้าไม่มีจริงๆ ค่อย fallback anon – อาจติด RLS)
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url) throw new Error('MISSING_ENV: SUPABASE_URL')
    if (!key) throw new Error('MISSING_ENV: SUPABASE_SERVICE_ROLE_KEY_OR_ANON_KEY')
    return createClient(url, key, { auth: { persistSession: false } })
}
