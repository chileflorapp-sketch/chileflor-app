import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializa el cliente de Mercado Pago.
// Nota: Cuando tengas tu token real, debes agregarlo a un archivo .env.local como MP_ACCESS_TOKEN
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-1234567890-TOKEN-FALSO' 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mapeamos los productos del carrito al formato requerido por Mercado Pago
    const items = body.items.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: 'CLP',
    }));

    // Instanciamos el creador de preferencias
    const preference = new Preference(client);
    
    // Creamos la preferencia en los servidores de Mercado Pago
    const response = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dedicatoria/ORD-MP-${Date.now()}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout`,
        },
        auto_return: 'approved',
      }
    });

    // Devolvemos el init_point (URL a la que el usuario debe ser redirigido para pagar)
    return NextResponse.json({ url: response.init_point });
    
  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: 'Fallo al procesar el pago con Mercado Pago' }, { status: 500 });
  }
}
