'use client';

export default function StatsBar() {
  const stats = [
    { value: '12.000+', label: 'Pedidos entregados', icon: '📦' },
    { value: '5.000+', label: 'Clientes felices', icon: '❤️' },
    { value: '98%', label: 'Satisfacción', icon: '⭐' },
    { value: '+7 años', label: 'En el mercado', icon: '🏆' },
  ];

  return (
    <div className="bg-gray-900 py-16 relative overflow-hidden reveal">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">{s.icon}</div>
              <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{s.value}</div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
