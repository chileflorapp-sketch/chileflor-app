'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load products once
  useEffect(() => {
    if (open && all.length === 0) {
      setLoading(true);
      fetch('/api/catalogo')
        .then(r => r.json())
        .then(d => { setAll(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const term = query.toLowerCase();
    const filtered = all
      .filter(p => p.estado !== 'fuera_de_temporada')
      .filter(p =>
        (p.nombre || '').toLowerCase().includes(term) ||
        (p.categoria || '').toLowerCase().includes(term) ||
        (p.subcategoria || '').toLowerCase().includes(term)
      )
      .slice(0, 6);
    setResults(filtered);
  }, [query, all]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col" role="dialog" aria-modal="true" aria-label="Búsqueda">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Search panel */}
      <div className="relative z-10 w-full max-w-2xl mx-auto mt-20 md:mt-28 px-4">
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center px-5 py-4 border-b border-gray-100">
            <Search size={20} className="text-gray-400 flex-shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar flores, ramos, regalos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery('')} className="ml-2 text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            )}
            <button onClick={onClose} className="ml-3 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-2 py-1 rounded-md transition-colors">
              ESC
            </button>
          </div>

          {/* Results */}
          {loading && (
            <div className="p-6 text-center text-gray-400 text-sm">Cargando...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <span className="text-3xl mb-3 block">🌾</span>
              <p className="text-gray-500 text-sm">No encontramos "{query}". Intenta con otro término.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
              {results.map(item => (
                <li key={item.id}>
                  <a
                    href={`/catalogo/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                      <Image src={item.imagen} alt={item.nombre} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{item.subcategoria} · {item.categoria}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-primary text-sm">${item.precio_base?.toLocaleString('es-CL')}</p>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors ml-auto mt-1" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!query && !loading && (
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorías populares</p>
              <div className="flex flex-wrap gap-2">
                {['Flores', 'Ramos de Rosas', 'Regalos', 'Homenajes'].map(cat => (
                  <a
                    key={cat}
                    href={`/catalogo?cat=${encodeURIComponent(cat)}`}
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm font-medium rounded-full transition-all"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
