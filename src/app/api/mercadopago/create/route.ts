import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar cliente de MP
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, total, email } = body;

    if (!orderId || !total) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (orderId, total)' }, { status: 400 });
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chileflor.cl';

    // Crear la preferencia
    const preference = new Preference(client);
    
    const response = await preference.create({
      body: {
        items: [
          {
            id: orderId,
            title: `Pedido Chileflor #${orderId}`,
            quantity: 1,
            unit_price: Number(total),
            currency_id: 'CLP',
          }
        ],
        payer: {
          email: email || 'cliente@chileflor.cl',
        },
        back_urls: {
          success: `${host}/checkout/exito?order=${orderId}`,
          failure: `${host}/checkout?error=pago_rechazado`,
          pending: `${host}/checkout/exito?order=${orderId}&status=pending`
        },
        auto_return: 'approved',
        notification_url: `${host}/api/webhooks/mercadopago`,
        external_reference: orderId,
      }
    });

    return NextResponse.json({ url: response.init_point });
  } catch (error: any) {
    console.error('Error creando preferencia MP:', error);
    return NextResponse.json(
      { error: 'Error procesando el pago con Mercado Pago', details: error.message },
      { status: 500 }
    );
  }
}
