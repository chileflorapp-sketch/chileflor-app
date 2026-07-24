'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Loader2, ShoppingBag, ArrowLeft, Star, Shield, Truck, RefreshCcw, Heart } from 'lucide-react';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedComplements, setSelectedComplements] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const COMPLEMENTS = [
    { name: 'Chocolates Ferrero', price: 8990, icon: '🍫' },
    { name: 'Globo Te Amo', price: 4990, icon: '🎈' },
    { name: 'Tarjeta Premium', price: 2990, icon: '✉️' },
    { name: 'Peluche Osito', price: 12990, icon: '🧸' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/catalogo');
        if (!res.ok) throw new Error('Error cargando catálogo');
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
        const found = Array.isArray(data) ? data.find((p: any) => p.id === id) : null;
        if (found) {
          setProduct(found);
          setCurrentImage(found.imagen);
          if (found.tags_visuales?.colores?.length > 0) {
            setSelectedColor(found.tags_visuales.colores[0]);
          }
        } else {
          router.push('/catalogo');
        }
      } catch (err) {
        console.error(err);
        router.push('/catalogo');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    const complementsTotal = selectedComplements.reduce((sum, c) => sum + c.price, 0);
    const total = product.precio_base + complementsTotal;
    const colorSuffix = selectedColor ? ` (${selectedColor})` : '';
    const compSuffix = selectedComplements.length > 0 ? ` + ${selectedComplements.map(c => c.name).join(' + ')}` : '';
    
    // Generar un ID único que combine el producto y el color si existe
    const cartItemId = selectedColor 
      ? `${product.id}-${selectedColor}`
      : parseInt(product.id.replace('p-', '')) || Date.now();

    addToCart({
      id: cartItemId,
      name: product.nombre + colorSuffix + compSuffix,
      price: total,
      image: product.imagen,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) return null;

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.categoria === product.categoria && p.estado !== 'fuera_de_temporada')
    .slice(0, 4);

  const complementsTotal = selectedComplements.reduce((sum, c) => sum + c.price, 0);
  const totalPrice = product.precio_base + complementsTotal;

  const productImages = product.tags_visuales?.galeria?.length > 0 
    ? product.tags_visuales.galeria 
    : (product.imagen ? [product.imagen] : []);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Volver
          </button>
          <span>/</span>
          <a href="/catalogo" className="hover:text-primary transition-colors">Catálogo</a>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-20">

          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-3xl overflow-hidden shadow-lg bg-gray-50 border border-gray-100">
              <Image
                src={currentImage || product.imagen}
                alt={product.nombre}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${
                    product.badge.includes('Entrega Hoy') ? 'bg-yellow-400/90 text-yellow-900' :
                    product.badge.includes('Premium') ? 'bg-gray-900/90 text-yellow-400' :
                    'bg-green-500/90 text-white'
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.nombre,
                  price: product.precio_base,
                  image: product.imagen,
                  category: product.categoria
                })}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-500 hover:text-primary transition-all shadow-md hover:scale-105 active:scale-95"
                aria-label="Agregar a favoritos"
              >
                <Heart size={18} className={isInWishlist(product.id) ? 'fill-primary text-primary' : ''} />
              </button>
            </div>
            {/* Miniaturas decorativas */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 relative ${
                      currentImage === img ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Vista ${i+1}`} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2 flex-wrap">
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-lg">{product.subcategoria || product.categoria}</span>
              <span className="text-gray-400 text-xs">SKU: {product.id?.toUpperCase()}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.nombre}</h1>

            {/* Stars decorativas */}
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-yellow-400 text-yellow-400" />)}
              <span className="text-sm text-gray-500 ml-1">(4.9) · {product.ventas || 0} ventas</span>
            </div>

            <p className="text-3xl font-black text-gray-900 tracking-tight mb-2">
              ${totalPrice.toLocaleString('es-CL')}
              {selectedComplements.length > 0 && (
                <span className="text-base font-normal text-gray-500 ml-2 block sm:inline mt-1 sm:mt-0">
                  (incluye {selectedComplements.map(c => c.name).join(', ')})
                </span>
              )}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6 text-base">
              {product.descripcion || `Un arreglo floral espectacular diseñado cuidadosamente por nuestros expertos floristas. Garantizamos frescura absoluta y la más alta calidad en cada tallo para que puedas expresar lo que sientes de la manera más hermosa.`}
            </p>

            {/* Selector de Color */}
            {product.tags_visuales?.colores && product.tags_visuales.colores.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Opciones de Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags_visuales.colores.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Complementos */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Añade un Complemento (Opcional)</h3>
              <div className="flex gap-3 flex-wrap">
                {COMPLEMENTS.map((comp, i) => {
                  const isSelected = selectedComplements.some(c => c.name === comp.name);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedComplements(prev => prev.filter(c => c.name !== comp.name));
                        } else {
                          setSelectedComplements(prev => [...prev, comp]);
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-2xl border-2 text-center cursor-pointer transition-all w-24 ${
                        isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 hover:border-primary/40 bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-1">{comp.icon}</span>
                      <span className="text-[10px] font-semibold text-gray-700 leading-tight mb-0.5">{comp.name}</span>
                      <span className="text-xs font-bold text-primary">+${comp.price.toLocaleString('es-CL')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Garantías */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <Truck size={18} />, text: 'Entrega Hoy' },
                { icon: <Shield size={18} />, text: 'Pago Seguro' },
                { icon: <RefreshCcw size={18} />, text: 'Frescura 100%' },
              ].map((g, i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl py-3 px-2 border border-gray-100">
                  <span className="text-primary">{g.icon}</span>
                  <span className="text-[11px] font-semibold text-gray-600 text-center">{g.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              className={`w-full font-bold text-lg py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                addedToCart
                  ? 'bg-green-500 text-white shadow-green-200'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-primary/30 hover:-translate-y-0.5 hover:shadow-xl'
              }`}
            >
              <ShoppingBag size={22} />
              {addedToCart ? '¡Agregado al Carrito! ✓' : `Agregar al Carrito · $${totalPrice.toLocaleString('es-CL')}`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Pago 100% seguro · Envío disponible si compras antes de las 20:00 hrs.
            </p>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">También te podría gustar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(item => (
                <a
                  href={`/catalogo/${item.id}`}
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50">
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      quality={75}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.nombre}</h3>
                    <p className="text-primary font-black mt-1">${item.precio_base.toLocaleString('es-CL')}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
