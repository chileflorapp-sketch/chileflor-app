'use client';

const defaultShortcuts = [
  { icon: '⚡', label: 'Entrega Hoy', link: '/catalogo?badge=Entrega+Hoy', badge: 'Hoy', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' },
  { icon: '🌹', label: 'Rosas', link: '/catalogo?cat=Flores', color: 'bg-rose-500/10 text-rose-600 border-rose-500/30' },
  { icon: '💐', label: 'Ramos', link: '/catalogo?cat=Ramos de Flores', color: 'bg-pink-500/10 text-pink-600 border-pink-500/30' },
  { icon: '💌', label: 'Tarjeta QR', link: '/dedicatoria/nueva', badge: 'Nuevo', color: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/30' },
  { icon: '📱', label: 'Escáner QR', link: '/escaner', color: 'bg-purple-500/10 text-purple-600 border-purple-500/30' },
  { icon: '🕊️', label: 'Homenajes', link: '/catalogo?cat=Homenajes', color: 'bg-slate-500/10 text-slate-600 border-slate-500/30' },
  { icon: '🎁', label: 'Regalos', link: '/catalogo?cat=Regalos', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' },
  { icon: '⛪', label: 'Cementerios', link: '/cementerios', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' },
];

export default function QuickAppActions({ shortcuts }: { shortcuts?: any[] }) {
  const list = (Array.isArray(shortcuts) && shortcuts.length > 0) ? shortcuts : defaultShortcuts;

  return (
    <section className="bg-white/95 backdrop-blur-md py-4 border-b border-gray-100 shadow-sm sticky top-[76px] md:top-[88px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 snap-x">
          {list.map((item: any, i: number) => (
            <a
              key={i}
              href={item.link}
              className={`shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${item.color || 'bg-rose-500/10 text-rose-600 border-rose-500/30'} font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all shadow-sm relative`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-primary text-white font-extrabold uppercase px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
