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
