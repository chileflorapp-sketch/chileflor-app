'use client';
import database from '@/data/database.json';
import { redirect, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const dbProduct = database.find((p) => p.id === params.id);

  if (!dbProduct) {
    redirect('/catalogo');
  }

  // Map to the format expected by the UI
  const product = {
    id: dbProduct.id,
    name: dbProduct.nombre,
    category: dbProduct.categoria,
    price: dbProduct.precio_base,
    image: dbProduct.imagen,
    description: "Un arreglo espectacular diseñado cuidadosamente por nuestros expertos floristas."
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-3xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-800 border border-white">
                {product.category}
              </span>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3, 4].map(thumb => (
              <div key={thumb} className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-primary transition-all overflow-hidden opacity-70 hover:opacity-100">
                 <img src={product.image} alt={`Miniatura ${thumb}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">Envío Hoy Disponible</span>
              <span className="text-gray-400 text-sm">SKU: {product.id.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-900 mb-4">${product.price.toLocaleString('es-CL')}</p>
            <p className="text-gray-600 leading-relaxed">
              {product.description} Este arreglo está preparado cuidadosamente por nuestros floristas expertos, garantizando frescura y la más alta calidad en cada tallo.
            </p>
          </div>

          {/* Complements */}
          <div className="mb-8 border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Agrega un complemento (Opcional)</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {[
                { name: 'Chocolates Ferrero', price: 8990, icon: '🍫' },
                { name: 'Globo Te Amo', price: 4990, icon: '🎈' },
                { name: 'Tarjeta Premium', price: 2990, icon: '✉️' }
              ].map((comp, i) => (
                <div key={i} className="snap-start shrink-0 w-32 border border-gray-200 rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer hover:border-primary transition-colors">
                  <span className="text-3xl mb-2">{comp.icon}</span>
                  <span className="text-xs font-medium text-gray-700 mb-1">{comp.name}</span>
                  <span className="text-sm font-bold text-primary">+${comp.price.toLocaleString('es-CL')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => {
                addToCart({
                  id: parseInt(product.id.replace('p-','')) || Date.now(),
                  name: product.name,
                  price: product.price,
                  image: product.image
                });
                router.push('/checkout');
              }}
              className="w-full bg-primary text-white font-medium text-lg py-4 rounded-full shadow-md hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <span>Agregar al Carrito</span>
              <span>-</span>
              <span>${product.price.toLocaleString('es-CL')}</span>
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Pago seguro y garantizado. Envío disponible para hoy si compras antes de las 20:00 hrs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
