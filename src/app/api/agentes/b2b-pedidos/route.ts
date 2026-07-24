import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase-admin';

const DB_FILE = path.join(process.cwd(), 'data', 'pedidos_b2b.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeDB(data: any) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const localData = await readDB();
    
    // Attempt Supabase fetch if available
    try {
      const { data: dbOrders } = await supabaseAdmin
        .from('pedidos')
        .select('*')
        .eq('tipo', 'b2b');

      if (dbOrders && dbOrders.length > 0) {
        return NextResponse.json([...dbOrders, ...localData]);
      }
    } catch {
      // Fallback to local
    }

    return NextResponse.json(localData);
  } catch (error) {
    console.error('GET Pedidos B2B Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newOrder = await request.json();
    const orderRecord = {
      id: `b2b-ord-${Date.now()}`,
      cliente: newOrder.cliente || 'Florería Mayorista',
      telefono: newOrder.telefono || '+56979992848',
      empresa: newOrder.empresa || 'Cliente B2B',
      rut: newOrder.rut || '',
      detalles: newOrder.detalles || [],
      total: newOrder.total || 0,
      tipo: 'b2b',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // 1. Guardar en JSON local para CRM Agentes
    let data = await readDB();
    data.unshift(orderRecord);
    await writeDB(data);

    // 2. Intentar guardar en Supabase si la tabla pedidos existe
    try {
      await supabaseAdmin.from('pedidos').insert({
        id: orderRecord.id,
        total: orderRecord.total,
        status: 'preparing',
        delivery_data: {
          cliente: orderRecord.cliente,
          telefono: orderRecord.telefono,
          empresa: orderRecord.empresa,
          tipo: 'b2b',
          detalles: orderRecord.detalles
        }
      });
    } catch (e) {
      // Supabase insert fallback ignored silently
    }

    return NextResponse.json({ success: true, order: orderRecord });
  } catch (error) {
    console.error('POST Pedido B2B Error:', error);
    return NextResponse.json({ error: 'Failed to record B2B order' }, { status: 500 });
  }
}
