import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('etiquetas_b2b')
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
    const newTag = await request.json();
    if (!newTag.id) newTag.id = crypto.randomUUID();

    const { data, error } = await supabaseAdmin
      .from('etiquetas_b2b')
      .insert([{
        id: newTag.id,
        nombre: newTag.nombre,
        categoria: newTag.categoria || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert Etiqueta Error:', error);
      throw error;
    }
    return NextResponse.json({ success: true, etiqueta: data });
  } catch (error: any) {
    console.error('POST Etiqueta Catch Error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabaseAdmin.from('etiquetas_b2b').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
