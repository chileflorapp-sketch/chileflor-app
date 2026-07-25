import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'clientes_vip.json');

// Inicializamos con algunos datos por defecto si el archivo no existe
const INITIAL_DATA = [
  { id: 'CLI-001', nombre: 'María González', correo: 'maria.g@email.com', nivel: 'Flor VIP', puntos: 12500, compras: 12 },
  { id: 'CLI-002', nombre: 'Juan Pérez', correo: 'juan.p@email.com', nivel: 'Brote', puntos: 2500, compras: 3 },
  { id: 'CLI-003', nombre: 'Camila Rojas', correo: 'camila.r@email.com', nivel: 'Semilla', puntos: 500, compras: 1 },
];

async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Si no existe, lo creamos con iniciales
    await writeDB(INITIAL_DATA);
    return INITIAL_DATA;
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
      // Actualizar nivel basado en puntos
      if (data[index].puntos >= 10000) data[index].nivel = 'Flor VIP';
      else if (data[index].puntos >= 2000) data[index].nivel = 'Brote';
      else data[index].nivel = 'Semilla';

      await writeDB(data);
      return NextResponse.json({ success: true, client: data[index] });
    } else {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const newClient = await request.json();
    
    if (!newClient.id) {
      newClient.id = `CLI-${Date.now()}`;
    }
    if (!newClient.puntos) newClient.puntos = 0;
    if (!newClient.compras) newClient.compras = 0;
    newClient.nivel = 'Semilla';

    let data = await readDB();
    data.push(newClient);
    await writeDB(data);

    return NextResponse.json({ success: true, client: newClient });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
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
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
  }
}
