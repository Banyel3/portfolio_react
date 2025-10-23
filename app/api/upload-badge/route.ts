import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase keys not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExt = (file as any).name?.split(".").pop() ?? "bin";
    const fileName = `badges/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("badges")
      .upload(fileName, buffer, {
        contentType: (file as any).type || "application/octet-stream",
        upsert: false,
      });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: publicData } = supabase.storage
      .from("badges")
      .getPublicUrl(data.path);

    return NextResponse.json({
      path: data.path,
      publicUrl: publicData.publicUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { path } = await req.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Supabase keys not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.storage.from("badges").remove([path]);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
