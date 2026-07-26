import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || url.searchParams.get('topic');
    const id = url.searchParams.get('data.id') || url.searchParams.get('id');

    // También verificamos si viene en el body
    const body = await request.json().catch(() => ({}));
    const eventAction = body.action || action;
    const paymentId = body?.data?.id || id;

    if (!paymentId || (eventAction !== 'payment.created' && eventAction !== 'payment.updated' && eventAction !== 'payment')) {
      return NextResponse.json({ success: true, message: 'Evento ignorado (no es un pago nuevo o actualizado)' });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN || '';
    if (!accessToken) {
      console.error('Webhook error: Falta MP_ACCESS_TOKEN');
      return NextResponse.json({ error: 'Token no configurado' }, { status: 500 });
    }

    // Consultamos a Mercado Pago por los detalles de este pago usando el ID
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    
    const paymentData = await payment.get({ id: paymentId }).catch((err: any) => {
      console.error('Error al obtener el pago de MP:', err);
      return null;
    });

    if (!paymentData) {
      return NextResponse.json({ error: 'No se pudo verificar el pago' }, { status: 404 });
    }

    // El external_reference contiene el codigo_orden de nuestro sistema (ej: ORD-12345)
    const orderId = paymentData.external_reference;
    const paymentStatus = paymentData.status;

    if (!orderId) {
      return NextResponse.json({ success: true, message: 'Pago sin external_reference, ignorando.' });
    }

    // Verificamos si el pago fue aprobado
    if (paymentStatus === 'approved') {
      // Actualizamos el pedido en Supabase
      const { error } = await supabaseAdmin
        .from('pedidos')
        .update({ estado: 'paid' })
        .eq('codigo_orden', orderId);

      if (error) {
        console.error('Error al actualizar pedido en BD:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      console.log(`Pedido ${orderId} actualizado a "paid" mediante webhook.`);
    }

    return NextResponse.json({ success: true, message: 'Notificación procesada correctamente' });

  } catch (error) {
    console.error('Error procesando Webhook de MP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
