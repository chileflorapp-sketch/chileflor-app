'use client';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'María González', role: 'Cliente frecuente', rating: 5,
    text: 'Los arreglos son hermosos y llegaron a tiempo. Mi mamá quedó encantada con las flores por su cumpleaños.',
    date: 'Julio 2025', avatar: 'M', color: 'bg-rose-500',
  },
  {
    name: 'Juan Pérez', role: 'Primera compra', rating: 5,
    text: 'Excelente servicio. La calidad de las rosas es impresionante, duraron mucho tiempo. 100% recomendados.',
    date: 'Junio 2025', avatar: 'J', color: 'bg-blue-500',
  },
  {
    name: 'Camila Rojas', role: 'Miembro Club VIP', rating: 5,
    text: 'Muy amables en la atención y el proceso de compra es muy fácil. Las flores llegaron frescas y hermosas.',
    date: 'Mayo 2025', avatar: 'C', color: 'bg-purple-500',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden reveal">
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">Testimonios</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
            <span className="text-gray-500 text-sm ml-2">4.9/5 basado en +500 reseñas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-100 hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-6 right-8 text-8xl text-primary/5 font-serif leading-none select-none">"</div>
              <div className="flex gap-1 mb-5">
                {Array(r.rating).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">"{r.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-10 h-10 rounded-full ${r.color} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role} · {r.date}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Verificado</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
