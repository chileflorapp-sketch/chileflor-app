import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const checks: Record<string, any> = {
    supabase_url: url ? `${url.substring(0, 30)}...` : 'MISSING',
    service_role_key: serviceKey ? `${serviceKey.substring(0, 20)}...` : 'MISSING',
  };

  try {
    // Test if we can list buckets
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    checks.list_buckets = bucketsError
      ? { error: bucketsError.message }
      : { ok: true, buckets: buckets?.map((b) => b.name) };
  } catch (e: any) {
    checks.list_buckets = { exception: e.message };
  }

  try {
    // Try creating the bucket
    const { error: createError } = await supabaseAdmin.storage.createBucket('productos', { public: true });
    checks.create_bucket = createError
      ? { message: createError.message }
      : { ok: true };
  } catch (e: any) {
    checks.create_bucket = { exception: e.message };
  }

  return NextResponse.json(checks);
}
