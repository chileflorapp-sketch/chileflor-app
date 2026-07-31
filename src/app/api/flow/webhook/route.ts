import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const API_KEY = process.env.FLOW_API_KEY;
const SECRET_KEY = process.env.FLOW_SECRET_KEY;
const API_URL = process.env.FLOW_URL;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usamos el Service Role Key para poder actualizar el pedido ignorando RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getSignature(params: Record<string, string>) {
  const keys = Object.keys(params).sort();
  let toSign = '';
  keys.forEach((key) => {
    toSign += key + params[key];
  });
  
  const hmac = crypto.createHmac('sha256', SECRET_KEY || '');
  hmac.update(toSign);
  return hmac.digest('hex');
}

export async function POST(request: Request) {
  try {
    // Flow envía los datos mediante POST (application/x-www-form-urlencoded)
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 400 });
    }

    if (!API_KEY || !SECRET_KEY || !API_URL) {
      console.error("Flow no está configurado correctamente");
      return NextResponse.json({ error: 'Flow config missing' }, { status: 500 });
    }

    // 1. Consultar el estado del pago a Flow usando el token recibido
    const params: Record<string, string> = {
      apiKey: API_KEY,
      token: token,
    };
    params.s = getSignature(params);

    const checkFormData = new URLSearchParams();
    Object.keys(params).forEach(key => checkFormData.append(key, params[key]));

    const res = await fetch(`${API_URL}/payment/getStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: checkFormData.toString()
    });

    const flowData = await res.json();

    if (!res.ok) {
      console.error('Error verificando token en Flow:', flowData);
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Flow Status Codes:
    // 1 = Pendiente, 2 = Pagado, 3 = Rechazado, 4 = Anulado
    const isPaid = flowData.status === 2;
    const orderId = flowData.commerceOrder;

    if (isPaid) {
      // 2. Actualizar pedido en Supabase a 'paid'
      const { error } = await supabase
        .from('pedidos')
        .update({
          estado: 'paid', // El CRM y la tabla manejan 'paid' (vs 'pending_payment')
        })
        .eq('codigo_orden', orderId);

      if (error) {
        console.error('Error al actualizar pedido en BD:', error);
      } else {
        console.log(`Pedido ${orderId} pagado exitosamente en Flow.`);
        
        // --- INICIO: NOTIFICACIÓN A EQUIPO DE VENTAS ---
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;
        const webhookUrl = process.env.NOTIFICATIONS_WEBHOOK_URL;

        if (telegramToken && telegramChatId || webhookUrl) {
          try {
            // Obtener detalles de la orden para armar el mensaje
            const { data: orderData } = await supabase
              .from('pedidos')
              .select('*, cliente_id(*)')
              .eq('codigo_orden', orderId)
              .single();

            if (orderData) {
              const totalFormat = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(orderData.total);
              
              // Mensaje formateado
              const message = `🚨 *¡NUEVA VENTA CONFIRMADA!* 🚨\n\n` +
                              `🛍️ *Orden:* #${orderData.codigo_orden}\n` +
                              `💰 *Total:* ${totalFormat}\n` +
                              `📅 *Fecha de entrega:* ${orderData.fecha_entrega || 'No especificada'}\n\n` +
                              `👉 Revisa los detalles de esta orden en el panel CRM para prepararla.`;

              // Si tiene configurado Telegram
              if (telegramToken && telegramChatId) {
                const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
                await fetch(telegramUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                    parse_mode: 'Markdown'
                  })
                });
                console.log('Notificación de Telegram enviada exitosamente.');
              } 
              // Fallback a Discord / Slack Webhook
              else if (webhookUrl) {
                const payload = {
                  content: message, // Para Discord
                  text: message     // Para Slack
                };

                await fetch(webhookUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                console.log('Notificación de webhook enviada exitosamente.');
              }
            }
          } catch (notifError) {
            console.error('Error enviando notificación:', notifError);
          }
        }
        // --- FIN: NOTIFICACIÓN ---
      }
    } else {
      console.log(`Pago para orden ${orderId} no fue aprobado. Estado de Flow: ${flowData.status}`);
    }

    // Flow espera un HTTP 200 OK para no reintentar
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
