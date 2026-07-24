import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: pedidos, error } = await supabaseAdmin
      .from('pedidos')
      .select('id, cliente, telefono, detalles, total, created_at');

    if (error) throw error;

    const clientesMap = new Map();

    pedidos.forEach(p => {
      // Usar telefono como ID único de cliente, o nombre si no hay
      const clientId = p.telefono || p.cliente;
      if (!clientId) return;

      if (!clientesMap.has(clientId)) {
        clientesMap.set(clientId, {
          id: clientId,
          nombre: p.cliente,
          telefono: p.telefono,
          totalGastado: 0,
          pedidos: [],
          fechaPrimerPedido: p.created_at,
          fechaUltimoPedido: p.created_at,
        });
      }

      const clientInfo = clientesMap.get(clientId);
      clientInfo.totalGastado += Number(p.total) || 0;
      clientInfo.pedidos.push(p);

      if (new Date(p.created_at) < new Date(clientInfo.fechaPrimerPedido)) {
        clientInfo.fechaPrimerPedido = p.created_at;
      }
      if (new Date(p.created_at) > new Date(clientInfo.fechaUltimoPedido)) {
        clientInfo.fechaUltimoPedido = p.created_at;
      }
    });

    const clientes = Array.from(clientesMap.values())
      .map(c => ({
        ...c,
        frecuencia: c.pedidos.length,
        // Calculate days since last order
        diasDesdeUltimoPedido: Math.floor((new Date().getTime() - new Date(c.fechaUltimoPedido).getTime()) / (1000 * 3600 * 24))
      }))
      .sort((a, b) => b.totalGastado - a.totalGastado); // Sort by LTV descending

    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
