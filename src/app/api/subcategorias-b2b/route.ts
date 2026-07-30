import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('subcategorias_b2b')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      if (error.code === '42P01') return NextResponse.json([]);
      throw error;
    }
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSubcat = await request.json();
    if (!newSubcat.id) newSubcat.id = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from('subcategorias_b2b')
      .insert([{
        id: newSubcat.id,
        nombre: newSubcat.nombre,
        categoria: newSubcat.categoria || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert Subcategoria Error:', error);
      throw error;
    }
    return NextResponse.json({ success: true, subcategoria: data });
  } catch (error: any) {
    console.error('POST Subcategoria Catch Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabaseAdmin.from('subcategorias_b2b').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
