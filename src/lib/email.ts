// Utilidad para enviar correos transaccionales
// Usa Resend si está configurado, de lo contrario loguea (fallback silencioso)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Chileflor <noreply@chileflor.cl>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[Email Fallback] No RESEND_API_KEY. Would send to ${to}: "${subject}"`);
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Email Error]', err);
      return false;
    }

    console.log(`[Email OK] Sent to ${to}: "${subject}"`);
    return true;
  } catch (error) {
    console.error('[Email Exception]', error);
    return false;
  }
}

// Templates
export function emailCompraConfirmada(orderId: string, total: number, items: any[], compradorNombre: string) {
  const totalFormatted = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(total);
  const itemsHtml = items.map((item: any) => 
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${item.nombre || item.name}</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:center">${item.cantidad || item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;text-align:right">$${(item.precio || item.price)?.toLocaleString('es-CL')}</td></tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb">
      <div style="max-width:600px;margin:0 auto;background:#ffffff">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#c026d3);padding:40px 30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:28px">🌸 ¡Gracias por tu compra!</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:8px;font-size:14px">Tu pedido ha sido confirmado exitosamente</p>
        </div>
        
        <!-- Body -->
        <div style="padding:30px">
          <p style="color:#374151;font-size:16px;margin-bottom:20px">
            Hola <strong>${compradorNombre}</strong>,
          </p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6">
            Hemos recibido tu pago correctamente. Tu pedido <strong style="color:#7c3aed">#${orderId}</strong> está siendo preparado con mucho cariño.
          </p>
          
          <!-- Order Details -->
          <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px;color:#111827;font-size:16px">Detalle de tu pedido</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
              <thead>
                <tr style="background:#f3f4f6">
                  <th style="padding:8px 12px;text-align:left">Producto</th>
                  <th style="padding:8px 12px;text-align:center">Cant.</th>
                  <th style="padding:8px 12px;text-align:right">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="text-align:right;margin-top:12px;font-size:18px;font-weight:bold;color:#111827">
              Total: ${totalFormatted}
            </div>
          </div>
          
          <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:30px">
            Si tienes alguna pregunta, contáctanos por WhatsApp o responde a este correo.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background:#f3f4f6;padding:20px 30px;text-align:center">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            © ${new Date().getFullYear()} Chileflor · Flores con amor desde Santiago 🌷
          </p>
          <p style="color:#9ca3af;font-size:11px;margin-top:4px">
            <a href="https://www.chileflor.cl" style="color:#7c3aed;text-decoration:none">www.chileflor.cl</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function emailEnReparto(orderId: string, compradorNombre: string, direccion: string) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f9fafb">
      <div style="max-width:600px;margin:0 auto;background:#ffffff">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#059669,#10b981);padding:40px 30px;text-align:center">
          <h1 style="color:white;margin:0;font-size:28px">🚚 ¡Tus flores van en camino!</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:8px;font-size:14px">Pedido #${orderId}</p>
        </div>
        
        <!-- Body -->
        <div style="padding:30px">
          <p style="color:#374151;font-size:16px;margin-bottom:20px">
            Hola <strong>${compradorNombre}</strong>,
          </p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6">
            ¡Excelentes noticias! Tu pedido <strong style="color:#059669">#${orderId}</strong> ya salió de nuestra florería y va en camino hacia:
          </p>
          
          <div style="background:#ecfdf5;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #10b981">
            <p style="margin:0;color:#065f46;font-weight:bold;font-size:14px">📍 ${direccion || 'Dirección registrada en el pedido'}</p>
          </div>
          
          <div style="text-align:center;margin:30px 0">
            <a href="https://www.chileflor.cl/seguimiento/${orderId}" style="background:linear-gradient(135deg,#059669,#10b981);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:14px;display:inline-block">
              📦 Seguir mi pedido en vivo
            </a>
          </div>
          
          <p style="color:#6b7280;font-size:13px;text-align:center;margin-top:30px">
            Pronto recibirás tus flores. ¡Esperamos que las disfrutes! 🌸
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background:#f3f4f6;padding:20px 30px;text-align:center">
          <p style="color:#9ca3af;font-size:12px;margin:0">
            © ${new Date().getFullYear()} Chileflor · Flores con amor desde Santiago 🌷
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
