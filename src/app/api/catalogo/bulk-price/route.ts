import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { percentage } = await request.json();

    if (typeof percentage !== 'number' || percentage === 0) {
      return NextResponse.json({ error: 'Porcentaje inválido' }, { status: 400 });
    }

    const { data: products, error: fetchError } = await supabase.from('productos').select('id, precio_base');
    if (fetchError) throw fetchError;

    const multiplier = 1 + (percentage / 100);

    // Update en paralelo en chunks de 10
    for (let i = 0; i < products.length; i += 10) {
      const chunk = products.slice(i, i + 10);
      await Promise.all(
        chunk.map(p => 
          supabase
            .from('productos')
            .update({ precio_base: Math.round(p.precio_base * multiplier) })
            .eq('id', p.id)
        )
      );
    }

    return NextResponse.json({ success: true, updatedCount: products.length });
  } catch (error: any) {
    console.error('Bulk Price Update Error:', error);
    return NextResponse.json({ error: error.message || 'Error updating prices' }, { status: 500 });
  }
}
