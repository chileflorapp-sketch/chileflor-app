import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    // Inicializa el cliente de Mercado Pago aquí para que lea el .env más reciente en cada petición
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-1234567890-TOKEN-FALSO' 
    });
    
    const body = await request.json();
    const { items: cartItems, orderId, envio } = body;
    
    // 1. Mapeamos los productos del carrito al formato requerido por Mercado Pago
    const items = cartItems.map((item: any) => ({
      id: item.id.toString(),
      title: item.name, // Asegurarnos de usar 'name'
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: 'CLP',
    }));

    // 2. Si hay costos de envío, recargos o descuentos (ya unificados en "envio"), agregamos un ítem adicional
    if (envio && Number(envio) > 0) {
      items.push({
        id: 'ENVIO',
        title: 'Despacho y Recargos',
        quantity: 1,
        unit_price: Number(envio),
        currency_id: 'CLP',
      });
    }

    // Instanciamos el creador de preferencias
    const preference = new Preference(client);
    
    // Creamos la preferencia en los servidores de Mercado Pago
    const response = await preference.create({
      body: {
        items: items,
        external_reference: orderId, // Guardar el Order ID para conciliación
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dedicatoria/${orderId}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?error=pago_fallido`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?estado=pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'CHILEFLOR',
      }
    });

    // Devolvemos el init_point (URL a la que el usuario debe ser redirigido para pagar)
    return NextResponse.json({ url: response.init_point });
    
  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: 'Fallo al procesar el pago con Mercado Pago' }, { status: 500 });
  }
}
