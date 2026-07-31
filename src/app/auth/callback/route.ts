import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase as adminSupabase } from '@/lib/supabase'; // Asumiendo que lib/supabase.ts tiene la llave admin si es necesario, o usamos el mismo anon para clientes_vip si tiene RLS abierto.

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/mi-cuenta';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Registrar al usuario en clientes_vip si no existe
      const email = data.user.email?.toLowerCase().trim();
      const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || '';
      
      if (email) {
        // En Next.js app router server actions/routes, mejor usar un cliente normal (no admin) si RLS lo permite,
        // o si necesitamos saltar RLS, instanciar un cliente admin. 
        // Usaremos el mismo supabase auth ya autenticado:
        const { data: existingClient } = await supabase
          .from('clientes_vip')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (existingClient) {
          // Actualizar last_login
          await supabase.from('clientes_vip').update({ last_login: new Date().toISOString() }).eq('email', email);
        } else {
          // Crear nuevo cliente VIP
          await supabase.from('clientes_vip').insert([{
            email: email,
            full_name: fullName,
            tier: 'BRONZE',
            puntos_actuales: 100,
            puntos_historicos: 100,
            last_login: new Date().toISOString()
          }]);

          // Auditoría de puntos
          await supabase.from('vip_historial_puntos').insert([{
            email_cliente: email,
            cantidad: 100,
            tipo_transaccion: 'EARN',
            descripcion: 'Bono de Bienvenida al Club VIP (Login Social)'
          }]);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/club?error=CouldNotAuthenticate`);
}
