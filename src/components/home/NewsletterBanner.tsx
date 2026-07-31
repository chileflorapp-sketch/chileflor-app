'use client';
import { useState } from 'react';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [code, setCode] = useState('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) { setCode(data.discountCode); setStatus('success'); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <section className="container mx-auto px-4 py-8 reveal">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-rose-500 to-pink-600 p-10 md:p-16 text-white shadow-2xl">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left max-w-lg">
            <div className="inline-block bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-white/20 shadow-sm">
              🎁 Oferta exclusiva para nuevos suscriptores
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3 drop-shadow-md">
              Obtén <span className="underline decoration-yellow-400 underline-offset-4 text-yellow-300">10% de descuento</span> en tu primera compra
            </h2>
            <p className="text-white/90 text-lg font-medium drop-shadow-sm">Suscríbete ahora y recibe tu código de descuento instantáneamente en pantalla para usarlo hoy mismo.</p>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-3 min-w-[320px]">
            {status === 'success' ? (
              <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-center border border-white/40 shadow-2xl transform hover:scale-105 transition-all">
                <div className="text-5xl mb-4 animate-bounce">🎉</div>
                <p className="font-bold text-lg mb-2 text-white">¡Aquí tienes tu código!</p>
                <div className="bg-white text-rose-600 font-black text-2xl px-6 py-3 rounded-xl border-2 border-dashed border-rose-300 inline-block shadow-inner select-all">
                  {code}
                </div>
                <p className="text-white/80 text-xs mt-4 font-medium">Cópialo e ingrésalo al momento de pagar.</p>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-base font-medium shadow-inner"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === 'loading'}
                  className="w-full bg-white text-primary font-black py-4 rounded-2xl hover:bg-yellow-300 hover:text-rose-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {status === 'loading' ? 'Generando código...' : 'Quiero mi 10% de descuento →'}
                </button>
                {status === 'error' && (
                  <p className="text-yellow-300 text-sm text-center font-bold bg-black/20 p-2 rounded-lg">Hubo un problema. Intenta nuevamente.</p>
                )}
                <p className="text-white/80 text-xs text-center font-medium">Sin spam. Recibirás solo ofertas de valor real.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
