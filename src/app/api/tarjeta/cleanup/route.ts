import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// This endpoint is meant to be called by a cron job (e.g., Vercel Cron)
// It cleans up expired tarjetas:
// - If agradecido: delete after 48h from agradecido_at
// - If NOT agradecido: delete after 72h from created_at

export async function GET(req: Request) {
  // Optional: Verify cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // 1. Find tarjetas that were thanked more than 48h ago
    const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const { data: thankedExpired, error: err1 } = await supabaseAdmin
      .from('tarjetas')
      .select('id, image_url')
      .eq('agradecimiento', true)
      .lt('agradecido_at', cutoff48h);

    // 2. Find tarjetas NOT thanked and older than 72h
    const cutoff72h = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();
    const { data: unthankedExpired, error: err2 } = await supabaseAdmin
      .from('tarjetas')
      .select('id, image_url')
      .eq('agradecimiento', false)
      .lt('created_at', cutoff72h);

    if (err1 || err2) {
      console.error('Query errors:', err1, err2);
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
    }

    const toDelete = [...(thankedExpired || []), ...(unthankedExpired || [])];

    if (toDelete.length === 0) {
      return NextResponse.json({ success: true, deleted: 0, message: 'No expired cards found' });
    }

    // 3. Delete images from storage
    const fileNames = toDelete.map(t => {
      // Extract filename from URL: ...tarjetas_temporales/FILENAME.jpg
      const parts = t.image_url.split('/');
      return parts[parts.length - 1];
    }).filter(Boolean);

    if (fileNames.length > 0) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('tarjetas_temporales')
        .remove(fileNames);

      if (storageError) {
        console.error('Storage cleanup error:', storageError);
        // Continue anyway - DB cleanup is more important
      }
    }

    // 4. Delete records from database
    const ids = toDelete.map(t => t.id);
    const { error: deleteError } = await supabaseAdmin
      .from('tarjetas')
      .delete()
      .in('id', ids);

    if (deleteError) {
      console.error('DB delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete expired cards' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      deleted: toDelete.length,
      details: {
        thankedExpired: thankedExpired?.length || 0,
        unthankedExpired: unthankedExpired?.length || 0
      }
    });

  } catch (error) {
    console.error('Cleanup API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
