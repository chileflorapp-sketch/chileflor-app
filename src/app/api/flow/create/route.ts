import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_KEY = process.env.FLOW_API_KEY;
const SECRET_KEY = process.env.FLOW_SECRET_KEY;
const API_URL = process.env.FLOW_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
    const body = await request.json();
    const { orderId, total, email } = body;

    if (!API_KEY || !SECRET_KEY || !API_URL) {
      console.error("Flow no está configurado correctamente en las variables de entorno");
      return NextResponse.json({ error: 'Flow config missing' }, { status: 500 });
    }

    const params: Record<string, string> = {
      apiKey: API_KEY,
      commerceOrder: orderId,
      subject: `Pedido Chileflor #${orderId}`,
      currency: 'CLP',
      amount: total.toString(),
      email: email,
      paymentMethod: '9', // 9 representa todos los medios de pago configurados en Flow
      urlConfirmation: `${BASE_URL}/api/flow/webhook`,
      urlReturn: `${BASE_URL}/checkout/exito?order=${orderId}`,
    };

    // Firmar la petición usando HMAC SHA256
    params.s = getSignature(params);

    const formData = new URLSearchParams();
    Object.keys(params).forEach(key => formData.append(key, params[key]));

    const res = await fetch(`${API_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const data = await res.json();
    
    if (res.ok && data.url && data.token) {
      // Retornar la URL de redirección completa (URL + token)
      return NextResponse.json({ url: `${data.url}?token=${data.token}` });
    } else {
      console.error('Flow Error:', data);
      return NextResponse.json({ error: data.message || 'Error creando pago' }, { status: 400 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
