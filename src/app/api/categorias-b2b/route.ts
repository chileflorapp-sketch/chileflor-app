import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { B2B_CATEGORIAS } from '@/data/catalog-b2b';

const DB_FILE = path.join(process.cwd(), 'data', 'categorias_b2b.json');

async function readDB() {
  try {
    const fileContent = await fs.readFile(DB_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return B2B_CATEGORIAS;
  } catch (error) {
    return B2B_CATEGORIAS;
  }
}

async function writeDB(data: any) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const data = await readDB();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET Categorias B2B Error:', error);
    return NextResponse.json(B2B_CATEGORIAS);
  }
}

export async function POST(request: Request) {
  try {
    const newCategory = await request.json();
    if (!newCategory.id) {
      newCategory.id = `cat-${Date.now()}`;
    }

    let data = await readDB();
    data.push(newCategory);
    await writeDB(data);

    return NextResponse.json({ success: true, categoria: newCategory });
  } catch (error) {
    console.error('POST Categorias B2B Error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
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
    data = data.filter((c: any) => c.id !== String(id) && c.nombre !== id);
    await writeDB(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Categorias B2B Error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
