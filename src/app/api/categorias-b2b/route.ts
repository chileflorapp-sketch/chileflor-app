import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categorias_b2b')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase GET Categorias B2B Error:', error.message);
      // Fallback a categorías únicas desde la tabla de productos si la tabla no existe
      if (error.code === '42P01') {
        return NextResponse.json([]);
      }
      throw error;
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('GET Categorias B2B Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCategory = await request.json();
    if (!newCategory.id) {
      newCategory.id = crypto.randomUUID();
    }

    const { data, error } = await supabaseAdmin
      .from('categorias_b2b')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message || 'Error de base de datos' }, { status: 400 });
    }

    return NextResponse.json({ success: true, categoria: data });
  } catch (error: any) {
    console.error('POST Categorias B2B Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
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
      .from('categorias_b2b')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Categorias B2B Error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
