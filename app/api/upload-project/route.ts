import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB limit
const BUCKET = process.env.SUPABASE_BUCKET_NAME ?? "projects";

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("Supabase service key or URL not configured");
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const contentType = (file as any).type || "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads allowed" },
        { status: 400 }
      );
    }

    const originalName = (file as any).name ?? "upload";
    const fileExt = originalName.split(".").pop() ?? "png";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const supabase = getServiceSupabase();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType });

    if (uploadError) {
      console.error("[upload-project] upload error", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Try to get a public URL. If bucket is private, fall back to a signed URL.
    const publicRes = await supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    // getPublicUrl returns { data: { publicUrl: string } }
    let publicUrl = (publicRes as any)?.data?.publicUrl ?? null;

    if (!publicUrl) {
      // create a signed URL valid for 7 days
      const { data: signedData, error: signedErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);
      if (signedErr) {
        console.error("[upload-project] createSignedUrl error", signedErr);
        return NextResponse.json({ error: signedErr.message }, { status: 500 });
      }
      publicUrl = signedData?.signedUrl ?? null;
    }

    return NextResponse.json({ path: filePath, publicUrl });
  } catch (err: any) {
    console.error("[upload-project] POST error", err);
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { path: filePath } = await req.json();
    if (!filePath)
      return NextResponse.json({ error: "No path provided" }, { status: 400 });

    const supabase = getServiceSupabase();
    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) {
      console.error("[upload-project] DELETE error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[upload-project] DELETE error", err);
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
