import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'productos';
    const folder = (formData.get('folder') as string) || 'apariencia';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Tipo de archivo no permitido: ${file.type}` }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure bucket exists (upsert)
    const { error: bucketError } = await supabaseAdmin.storage.createBucket(bucket, {
      public: true,
      allowedMimeTypes: allowedTypes,
    });

    // Ignore "already exists" error
    if (bucketError && !bucketError.message.includes('already exists')) {
      console.error('Bucket error:', bucketError);
    }

    // Upload using service role (bypasses RLS)
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl, path: fileName });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}
