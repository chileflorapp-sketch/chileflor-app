import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('productos_b2b')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase GET Productos B2B Error:', error.message);
      // Intentar fallback a tabla productos filtrando por mayorista si productos_b2b no existe
      if (error.code === '42P01') { 
         const { data: fallbackData, error: fallbackError } = await supabaseAdmin
          .from('productos')
          .select('*')
          .eq('es_mayorista', true);
         if (!fallbackError) return NextResponse.json(fallbackData);
      }
      throw error;
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET Productos B2B Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const id = updates.id;
    delete updates.id;

    const { data, error } = await supabaseAdmin
      .from('productos_b2b')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error) {
    console.error('POST Productos B2B Error:', error);
    const msg = error instanceof Error ? error.message : (error as any).message || 'Failed to update data';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newProduct = await request.json();
    
    if (!newProduct.id) {
      newProduct.id = crypto.randomUUID();
    }

    const { data, error } = await supabaseAdmin
      .from('productos_b2b')
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error) {
    console.error('PUT Productos B2B Error:', error);
    const msg = error instanceof Error ? error.message : (error as any).message || 'Failed to create product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('productos_b2b')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Productos B2B Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
