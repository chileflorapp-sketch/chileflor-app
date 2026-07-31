'use client';
import { ChevronRight } from 'lucide-react';

export default function CategoryGrid({ config }: { config: any }) {
  if (!config) return null;
  return (
    <section className="container mx-auto px-4 py-16 reveal">
      <div className="text-center mb-12">
        <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] mb-3">{config.title}</p>
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          {config.subtitle} <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary via-pink-500 to-rose-400 bg-clip-text text-transparent animate-text-shimmer">{config.subtitleHighlight}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {config.items?.map((cat: any, i: number) => (
          <a key={i} href={cat.link} className="cat-card group relative rounded-3xl overflow-hidden aspect-[3/4] block shadow-lg">
            <div className="absolute inset-0">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70 group-hover:opacity-60 transition-opacity duration-500`} />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{cat.emoji}</div>
              <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-lg">{cat.name}</h3>
              <p className="text-white/70 text-sm mt-1 drop-shadow">{cat.sub}</p>
              <div className="mt-4 flex items-center gap-2 text-white/80 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400">
                Explorar <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
