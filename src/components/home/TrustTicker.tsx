'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function TrustTicker({ items }: { items?: string[] }) {
  const defaultItems = [
    '🌹 +12.000 ramos entregados', '⚡ Entrega el mismo día', '💳 Pago seguro 100%',
    '🌿 Flores frescas garantizadas', '📦 Seguimiento en tiempo real', '❤️ Más de 5.000 clientes felices',
    '🏆 La floristería N°1 de Chile', '🎁 Regalos personalizados con IA', '📸 Evidencia fotográfica en cada entrega',
  ];
  const list = (Array.isArray(items) && items.length > 0) ? items : defaultItems;
  const doubled = [...list, ...list];

  return (
    <div className="bg-gray-900 text-white py-3 overflow-hidden border-y border-gray-800 relative z-20">
      <div className="flex gap-12 animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-medium text-gray-300 shrink-0 flex items-center gap-2">
            {item}
            <span className="text-primary mx-4 opacity-40">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
