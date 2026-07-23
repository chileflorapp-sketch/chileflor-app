import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { image, orderId } = await req.json();

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
    
    // Generate unique ID (6 chars for URL)
    const uniqueId = crypto.randomBytes(4).toString('hex').slice(0, 7);
    const fileName = `${uniqueId}.jpg`;

    // 1. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('tarjetas_temporales')
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
    const { data: { publicUrl } } = supabase
      .storage
      .from('tarjetas_temporales')
      .getPublicUrl(fileName);

    // 3. Insert into database
    const { error: dbError } = await supabase
      .from('tarjetas')
      .insert({
        id: uniqueId,
        image_url: publicUrl,
        order_id: orderId,
        agradecimiento: false
      });

    if (dbError) {
      console.error('DB Error:', dbError);
      // Even if DB fails, maybe return the URL? Better to fail safely.
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
