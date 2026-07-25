import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CATALOGO_B2B } from '@/data/catalog-b2b';

const DB_FILE = path.join(process.cwd(), 'data', 'productos_b2b.json');

async function readDB() {
  try {
    const fileContent = await fs.readFile(DB_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    if (Array.isArray(data) && data.length > 0) {
      // Merge with initial defaults if custom array is small
      const existingIds = new Set(data.map((p: any) => p.id));
      const defaultsToAdd = CATALOGO_B2B.filter(p => !existingIds.has(p.id));
      return [...data, ...defaultsToAdd];
    }
    return CATALOGO_B2B;
  } catch (error) {
    return CATALOGO_B2B;
  }
}

async function writeDB(data: any) {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Skipping local writeDB (likely Vercel environment):', err);
  }
}

export async function GET() {
  try {
    const data = await readDB();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Productos B2B Error:', error);
    return NextResponse.json(CATALOGO_B2B);
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const id = updates.id;
    delete updates.id;

    let data = await readDB();
    let productIndex = data.findIndex((p: any) => p.id === id);
    
    if (productIndex !== -1) {
      data[productIndex] = { ...data[productIndex], ...updates };
      await writeDB(data);
      return NextResponse.json({ success: true, product: data[productIndex] });
    } else {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('POST Productos B2B Error:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newProduct = await request.json();
    
    if (!newProduct.id) {
      newProduct.id = `b2b-${Date.now()}`;
    }

    let data = await readDB();
    data.push(newProduct);
    await writeDB(data);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('PUT Productos B2B Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let data = await readDB();
    data = data.filter((p: any) => p.id !== id);
    await writeDB(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Productos B2B Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
