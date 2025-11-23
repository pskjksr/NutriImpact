import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

// helper
const toNumberArray = (rows: any[], key: string) =>
    rows.map(r => Number(r[key])).filter(n => Number.isFinite(n));

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") ?? "").toLowerCase();

    if (!["sugar", "fat", "sodium", "stress"].includes(type)) {
        return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }

    try {
        // 3.1 เคส STRESS → นับจำนวนแต่ละระดับจาก survey_section5
        if (type === "stress") {
            const { data, error } = await supabaseAdmin
                .from("survey_section5")
                .select("stress_level");
            if (error) throw error;

            const counts: Record<string, number> = {};
            for (const r of data ?? []) {
                const k = r.stress_level ?? "ไม่ระบุ";
                counts[k] = (counts[k] ?? 0) + 1;
            }

            const items = Object.entries(counts).map(([name, value]) => ({ name, value }));
            return NextResponse.json({ items });
        }

        // 3.2 sugar / fat / sodium → อ่านคะแนนจาก survey_section3 แล้วสรุป min/max/avg
        const col = type === "sugar" ? "sugar_score" : type === "fat" ? "fat_score" : "sodium_score";

        const { data, error } = await supabaseAdmin
            .from("survey_section3")
            .select(col);
        if (error) throw error;

        const nums = toNumberArray(data ?? [], col);
        const avg = nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
        const min = nums.length ? Math.min(...nums) : 0;
        const max = nums.length ? Math.max(...nums) : 0;

        const items = [
            { name: "เฉลี่ย", value: Number(avg.toFixed(2)) },
            { name: "ต่ำสุด", value: min },
            { name: "สูงสุด", value: max },
        ];

        return NextResponse.json({ items });
    } catch (e: any) {
        return NextResponse.json({ error: e.message ?? "server error" }, { status: 500 });
    }
}
