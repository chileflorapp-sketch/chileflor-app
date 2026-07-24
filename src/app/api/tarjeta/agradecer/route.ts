import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing card id' }, { status: 400 });
    }

    // First check if the card exists and isn't expired
    const { data: tarjeta, error: fetchError } = await supabaseAdmin
      .from('tarjetas')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !tarjeta) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check 72h hard expiration
    const createdAt = new Date(tarjeta.created_at);
    const now = new Date();
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (diffHours > 72) {
      return NextResponse.json({ error: 'Card has expired' }, { status: 410 });
    }

    // Already thanked?
    if (tarjeta.agradecimiento) {
      return NextResponse.json({ success: true, alreadyThanked: true });
    }

    // Update database - mark as thanked with timestamp
    const { error: dbError } = await supabaseAdmin
      .from('tarjetas')
      .update({ 
        agradecimiento: true,
        agradecido_at: new Date().toISOString()
      })
      .eq('id', id);

    if (dbError) {
      console.error('DB Error:', dbError);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
