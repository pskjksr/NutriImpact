
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({
        has_SUPABASE_URL: !!process.env.SUPABASE_URL,
        has_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
}
