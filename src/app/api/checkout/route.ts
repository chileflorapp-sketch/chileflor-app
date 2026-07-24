import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const accessToken = (process.env.MP_ACCESS_TOKEN || '').trim();

    if (!accessToken || accessToken === 'TEST-1234567890-TOKEN-FALSO') {
      return NextResponse.json({ 
        error: 'El token de Mercado Pago no está configurado en el servidor.' 
      }, { status: 400 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const body = await request.json();
    const { items: cartItems, orderId, envio } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }
    
    // 1. Mapeamos los productos del carrito al formato de Mercado Pago
    const items = cartItems.map((item: any) => ({
      id: String(item.id || 'p-1'),
      title: item.name || item.nombre || 'Arreglo Floral Chileflor',
      quantity: Number(item.quantity || item.cantidad || 1),
      unit_price: Math.round(Number(item.price || item.precio || 0)),
      currency_id: 'CLP',
    }));

    // 2. Si hay costo de envío / recargos netos positivos, agregamos ítem de envío
    if (envio && Number(envio) > 0) {
      items.push({
        id: 'ENVIO',
        title: 'Despacho y Recargos',
        quantity: 1,
        unit_price: Math.round(Number(envio)),
        currency_id: 'CLP',
      });
    }

    // Instanciamos el creador de preferencias
    const preference = new Preference(client);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 3. Crear preferencia en Mercado Pago
    const response = await preference.create({
      body: {
        items: items,
        external_reference: String(orderId || `ORD-${Date.now()}`),
        back_urls: {
          success: `${siteUrl}/dedicatoria/${orderId || 'general'}?estado=aprobado`,
          failure: `${siteUrl}/checkout?error=pago_fallido`,
          pending: `${siteUrl}/checkout?estado=pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'CHILEFLOR',
      }
    });

    // Devolvemos el init_point (URL de checkout de Mercado Pago)
    const checkoutUrl = response.init_point || response.sandbox_init_point;
    
    if (!checkoutUrl) {
      throw new Error('Mercado Pago no devolvió URL de checkout');
    }

    return NextResponse.json({ 
      success: true, 
      url: checkoutUrl,
      preferenceId: response.id 
    });
    
  } catch (error: any) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    
    const isInvalidToken = error?.message?.includes('invalid_token') || 
                           error?.code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES' ||
                           error?.status === 401 || error?.status === 403;

    return NextResponse.json({ 
      error: isInvalidToken 
        ? 'El Access Token de Mercado Pago es inválido o ha expirado.' 
        : 'Fallo al procesar la preferencia de pago en Mercado Pago.',
      details: error?.message || String(error)
    }, { status: isInvalidToken ? 401 : 500 });
  }
}
