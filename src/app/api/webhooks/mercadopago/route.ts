import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendEmail, emailCompraConfirmada } from '@/lib/email';

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
      
      const { data: existingOrder } = await supabaseAdmin
        .from('pedidos')
        .select('estado')
        .eq('codigo_orden', orderId)
        .single();

      if (existingOrder && (existingOrder.estado === 'paid' || existingOrder.estado === 'pagado')) {
        return NextResponse.json({ success: true, message: 'Pedido ya estaba marcado como pagado' });
      }

      // Actualizamos el pedido en Supabase
      const { error } = await supabaseAdmin
        .from('pedidos')
        .update({ estado: 'pagado', metodo_pago: 'mercadopago' })
        .eq('codigo_orden', orderId);

      if (error) {
        console.error('Error al actualizar pedido en BD:', error);
        return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 });
      }

      console.log(`Pedido ${orderId} actualizado a "paid" mediante webhook de MP.`);

      // Enviar correo
      try {
        const { data: orderForEmail } = await supabaseAdmin
          .from('pedidos')
          .select('*')
          .eq('codigo_orden', orderId)
          .single();
        
        if (orderForEmail?.detalles?.comprador?.email) {
          const email = orderForEmail.detalles.comprador.email;
          const nombre = orderForEmail.detalles.comprador.nombre || 'Cliente';
          const items = orderForEmail.detalles.items || [];
          const htmlBody = emailCompraConfirmada(orderId, orderForEmail.total, items, nombre);
          await sendEmail({
            to: email,
            subject: `🌸 ¡Gracias por tu compra! Pedido #${orderId} confirmado`,
            html: htmlBody
          });
        }
      } catch (emailErr) {
        console.error('Error enviando email de confirmación (MP):', emailErr);
      }

      // Notificaciones
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      const webhookUrl = process.env.NOTIFICATIONS_WEBHOOK_URL;

      if (telegramToken && telegramChatId || webhookUrl) {
        try {
          const { data: orderData } = await supabaseAdmin
            .from('pedidos')
            .select('*, cliente_id(*)')
            .eq('codigo_orden', orderId)
            .single();

          if (orderData) {
            const totalFormat = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(orderData.total);
            const message = `🚨 *¡NUEVA VENTA CONFIRMADA (Mercado Pago)!* 🚨\n\n` +
                            `🛍️ *Orden:* #${orderData.codigo_orden}\n` +
                            `💰 *Total:* ${totalFormat}\n` +
                            `📅 *Fecha de entrega:* ${orderData.fecha_entrega || 'No especificada'}\n\n` +
                            `👉 Revisa los detalles en el panel CRM.`;

            if (telegramToken && telegramChatId) {
              const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
              await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: telegramChatId, text: message, parse_mode: 'Markdown' })
              });
            } else if (webhookUrl) {
              await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: message, text: message })
              });
            }
          }
        } catch (notifError) {
          console.error('Error enviando notificación (MP):', notifError);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Notificación procesada correctamente' });

  } catch (error) {
    console.error('Error procesando Webhook de MP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
