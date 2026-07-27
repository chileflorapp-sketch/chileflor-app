import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Insertar en newsletter_subscribers
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, source: 'homepage_banner' }]);

    // Si el error es de duplicidad (código 23505), no pasa nada, le damos el código
    if (error && error.code !== '23505') { 
      console.error('Error insertando email:', error);
    }

    return NextResponse.json({ success: true, discountCode: 'CHILEFLOR10' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
