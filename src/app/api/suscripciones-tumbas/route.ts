import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'suscripciones_tumbas.json');

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
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
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updates = await request.json();
    const id = updates.id;
    delete updates.id;

    let data = await readDB();
    let index = data.findIndex((p: any) => p.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      await writeDB(data);
      return NextResponse.json({ success: true, suscripcion: data[index] });
    } else {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newSuscripcion = await request.json();
    
    if (!newSuscripcion.id) {
      newSuscripcion.id = `TUM-${Date.now()}`;
    }
    
    newSuscripcion.fecha_registro = new Date().toISOString();

    let data = await readDB();
    data.push(newSuscripcion);
    await writeDB(data);

    return NextResponse.json({ success: true, suscripcion: newSuscripcion });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    let data = await readDB();
    data = data.filter((c: any) => c.id !== id);
    await writeDB(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
