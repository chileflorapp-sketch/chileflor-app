import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Redondea un precio al formato chileno tipo "X990":
 * Ej: 10230 → 9990 | 18400 → 17990 | 25100 → 24990
 * Lógica: redondea al millar/centena más cercana y le resta 10.
 */
function roundToChileanPrice(price: number): number {
  if (price <= 0) return price;

  // Determinamos la magnitud del redondeo según el valor
  let step: number;
  if (price < 2000)        step = 100;    // 990, 1990...
  else if (price < 10000)  step = 1000;   // 1990, 2990, 4990...
  else if (price < 50000)  step = 1000;   // 9990, 14990, 24990...
  else                     step = 5000;   // 49990, 54990...

  // Redondear al múltiplo de step más cercano (hacia abajo) y restar 10
  const rounded = Math.floor(price / step) * step;
  const candidate = rounded - 10;

  // Si el resultado es negativo o cero, usamos el paso anterior
  return candidate > 0 ? candidate : price;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { percentage, action, round } = body;

    // ── CASO 1: Restaurar precios originales ──────────────────────────────
    if (action === 'reset') {
      const { data: products, error: fetchError } = await supabase
        .from('productos')
        .select('id, precio_original');
      if (fetchError) throw fetchError;

      // Solo restaurar los que tienen precio_original guardado
      const toRestore = products.filter((p: any) => p.precio_original && p.precio_original > 0);
      if (toRestore.length === 0) {
        return NextResponse.json({ success: true, updatedCount: 0, message: 'No hay precios originales guardados.' });
      }

      for (let i = 0; i < toRestore.length; i += 10) {
        const chunk = toRestore.slice(i, i + 10);
        await Promise.all(
          chunk.map((p: any) =>
            supabase
              .from('productos')
              .update({ precio_base: p.precio_original })
              .eq('id', p.id)
          )
        );
      }
      return NextResponse.json({ success: true, updatedCount: toRestore.length, action: 'reset' });
    }

    // ── CASO 2: Redondear precios a formato X990 ──────────────────────────
    if (action === 'round') {
      const { data: products, error: fetchError } = await supabase
        .from('productos')
        .select('id, precio_base');
      if (fetchError) throw fetchError;

      for (let i = 0; i < products.length; i += 10) {
        const chunk = products.slice(i, i + 10);
        await Promise.all(
          chunk.map((p: any) =>
            supabase
              .from('productos')
              .update({ precio_base: roundToChileanPrice(p.precio_base) })
              .eq('id', p.id)
          )
        );
      }
      return NextResponse.json({ success: true, updatedCount: products.length, action: 'round' });
    }

    // ── CASO 3: Ajuste por porcentaje (comportamiento original) ───────────
    if (typeof percentage !== 'number' || percentage === 0) {
      return NextResponse.json({ error: 'Porcentaje inválido' }, { status: 400 });
    }

    const { data: products, error: fetchError } = await supabase
      .from('productos')
      .select('id, precio_base, precio_original');
    if (fetchError) throw fetchError;

    const multiplier = 1 + (percentage / 100);

    for (let i = 0; i < products.length; i += 10) {
      const chunk = products.slice(i, i + 10);
      await Promise.all(
        chunk.map((p: any) => {
          const newPrice = Math.round(p.precio_base * multiplier);
          const finalPrice = round ? roundToChileanPrice(newPrice) : newPrice;

          // Guardar el precio original la primera vez que se ajusta (si no existe)
          const updateData: any = { precio_base: finalPrice };
          if (!p.precio_original || p.precio_original === 0) {
            updateData.precio_original = p.precio_base;
          }

          return supabase
            .from('productos')
            .update(updateData)
            .eq('id', p.id);
        })
      );
    }

    return NextResponse.json({ success: true, updatedCount: products.length, action: 'percentage' });
  } catch (error: any) {
    console.error('Bulk Price Update Error:', error);
    return NextResponse.json({ error: error.message || 'Error updating prices' }, { status: 500 });
  }
}
