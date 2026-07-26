import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { image, message, orderId } = await req.json();

    if (!image || !orderId) {
      return NextResponse.json({ error: 'Missing image or orderId' }, { status: 400 });
    }

    // Parse base64 string
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid base64 string' }, { status: 400 });
    }

    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Generate unique ID (7 chars for short URL)
    const uniqueId = crypto.randomBytes(4).toString('hex').slice(0, 7);
    const fileName = `${uniqueId}.jpg`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from('tarjetas')
      .upload(fileName, buffer, {
        contentType: type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('tarjetas')
      .getPublicUrl(fileName);

    // 3. Insert into database
    const { error: dbError } = await supabaseAdmin
      .from('tarjetas')
      .insert({
        id: uniqueId,
        image_url: publicUrl,
        message: message || null,
        order_id: orderId,
        agradecimiento: false,
        agradecido_at: null
      });

    if (dbError) {
      console.error('DB Error:', dbError);
      // Cleanup the uploaded image if DB insert fails
      await supabaseAdmin.storage.from('tarjetas').remove([fileName]);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      id: uniqueId,
      url: publicUrl 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
