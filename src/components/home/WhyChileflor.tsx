'use client';
import { Truck, Shield, Clock, Sparkles } from 'lucide-react';

export default function WhyChileflor() {
  const perks = [
    {
      icon: <Truck className="w-7 h-7" />,
      title: 'Entrega el mismo día',
      desc: 'Pedidos antes de las 14:00 se entregan ese mismo día dentro de Santiago.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      ring: 'ring-blue-100',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Frescura garantizada',
      desc: 'Todas nuestras flores tienen garantía de frescura por 7 días o te la reponemos.',
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-100',
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Diseño personalizado',
      desc: 'Escríbenos por WhatsApp y nuestros floristas crean el arreglo de tus sueños.',
      color: 'from-purple-500 to-fuchsia-500',
      bg: 'bg-purple-50',
      ring: 'ring-purple-100',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Seguimiento en vivo',
      desc: 'Sigue tu pedido en tiempo real desde el momento en que sale de nuestra tienda.',
      color: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      ring: 'ring-orange-100',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28 reveal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">¿Por qué elegirnos?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            La diferencia <span className="text-primary">Chileflor</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Más que flores, entregamos experiencias memorables con el nivel de servicio que mereces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, i) => (
            <div key={i} className={`group relative p-8 rounded-3xl ${p.bg} ring-1 ${p.ring} hover:ring-2 hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {p.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              <span className="absolute top-6 right-6 text-6xl font-black text-black/5 select-none leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
