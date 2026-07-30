import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('ventas', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Supabase GET Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to read from Supabase' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, estado, badge, nombre, precio_base, imagen, descripcion, categoria, subcategoria, cross_sell, colores, galeria, tags, slug, meta_title, meta_description, meta_keywords, fondo, angulo, luz } = await request.json();

    const updates: any = {};
    if (estado !== undefined) updates.estado = estado;
    if (badge !== undefined) updates.badge = badge;
    if (nombre) updates.nombre = nombre;
    if (precio_base !== undefined) updates.precio_base = Number(precio_base);
    if (imagen) updates.imagen = imagen;
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (categoria) updates.categoria = categoria;
    if (subcategoria) updates.subcategoria = subcategoria;
    if (cross_sell !== undefined) updates.cross_sell = cross_sell;
    if (tags !== undefined) updates.tags = tags;
    if (slug !== undefined) updates.slug = slug;
    if (meta_title !== undefined) updates.meta_title = meta_title;
    if (meta_description !== undefined) updates.meta_description = meta_description;
    if (meta_keywords !== undefined) updates.meta_keywords = meta_keywords;

    if (colores !== undefined || galeria !== undefined || fondo !== undefined || angulo !== undefined || luz !== undefined) {
      const { data: currentProduct } = await supabase.from('productos').select('tags_visuales').eq('id', id).single();
      updates.tags_visuales = {
        ...(currentProduct?.tags_visuales || { fondo: "neutro", angulo: "frontal", luz: "estudio" })
      };
      if (colores !== undefined) updates.tags_visuales.colores = colores;
      if (galeria !== undefined) updates.tags_visuales.galeria = galeria;
      if (fondo !== undefined) updates.tags_visuales.fondo = fondo;
      if (angulo !== undefined) updates.tags_visuales.angulo = angulo;
      if (luz !== undefined) updates.tags_visuales.luz = luz;
    }

    const { data, error } = await supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('Supabase POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update Supabase', details: error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newProduct = await request.json();
    
    // Generar un ID único basado en timestamp
    if (!newProduct.id) {
      newProduct.id = `p-${Date.now()}`;
    }
    
    // Valores por defecto
    if (!newProduct.ventas) newProduct.ventas = 0;
    if (!newProduct.tags_visuales) newProduct.tags_visuales = { fondo: "neutro", angulo: "frontal", luz: "estudio" };
    if (!newProduct.estado) newProduct.estado = 'activo';

    // Mover colores, galeria y tags_visuales si viene en el payload
    if (newProduct.colores !== undefined) {
      newProduct.tags_visuales.colores = newProduct.colores;
      delete newProduct.colores;
    }
    if (newProduct.galeria !== undefined) {
      newProduct.tags_visuales.galeria = newProduct.galeria;
      delete newProduct.galeria;
    }
    if (newProduct.fondo !== undefined) {
      newProduct.tags_visuales.fondo = newProduct.fondo;
      delete newProduct.fondo;
    }
    if (newProduct.angulo !== undefined) {
      newProduct.tags_visuales.angulo = newProduct.angulo;
      delete newProduct.angulo;
    }
    if (newProduct.luz !== undefined) {
      newProduct.tags_visuales.luz = newProduct.luz;
      delete newProduct.luz;
    }

    const { data, error } = await supabase
      .from('productos')
      .insert([newProduct])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    console.error('Supabase PUT Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product', details: error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Supabase DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete product', details: error }, { status: 500 });
  }
}
