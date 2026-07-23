'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function NosotrosPage() {
  const [cfg, setCfg] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/config?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setCfg(d?.nosotros || null))
      .catch(console.error);
  }, []);

  if (!cfg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const { hero, fundadores, taller, stats, equipo, valores } = cfg;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
          >
            {hero.badge}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-tight"
          >
            {hero.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <Image
              src={hero.heroImage}
              alt={hero.title}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-10 md:p-16 text-left">
                <p className="text-white/90 text-lg md:text-2xl font-serif max-w-2xl leading-relaxed">
                  "{hero.quote}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fundadores Section */}
      <section className="container mx-auto px-4 max-w-4xl mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{fundadores.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">{fundadores.text1}</p>
            <p className="text-gray-600 leading-relaxed text-lg">{fundadores.text2}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                <Image src={fundadores.founder1Image} alt={fundadores.founder1Name} fill sizes="250px" quality={80} className="object-cover" />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">{fundadores.founder1Name}</h3>
                <p className="text-sm text-gray-500">{fundadores.founder1Role}</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">{fundadores.founder2Name}</h3>
                <p className="text-sm text-gray-500">{fundadores.founder2Role}</p>
              </div>
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                <Image src={fundadores.founder2Image} alt={fundadores.founder2Name} fill sizes="250px" quality={80} className="object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Historias de Taller */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative h-80 rounded-3xl overflow-hidden shadow-lg"
          >
            <Image src={taller.tallerImage} alt="Taller floral Chileflor" fill sizes="(max-width: 768px) 100vw, 50vw" quality={80} className="object-cover" />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">{taller.badge}</span>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">{taller.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{taller.text1}</p>
            <p className="text-gray-600 leading-relaxed">{taller.text2}</p>
          </motion.div>
        </div>
      </section>

      {/* Datos Interesantes */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900">Datos Curiosos</h2>
          <p className="text-gray-500 mt-2">Detrás de nuestros números hay miles de sonrisas.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((dato: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center hover:shadow-lg transition-shadow hover:border-primary/20"
            >
              <div className="text-4xl font-black text-gray-900 mb-2">{dato.num}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{dato.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section className="container mx-auto px-4 max-w-5xl mb-24">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Nuestro Equipo</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Los Artesanos Florales</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {equipo.map((person: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group text-center"
            >
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 shadow-xl border-4 border-white group-hover:border-primary/20 transition-colors relative">
                <Image src={person.img} alt={person.name} fill sizes="192px" quality={80} className="object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
              <p className="text-primary font-medium text-sm mb-4">{person.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed px-4">{person.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="bg-gray-900 text-white py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-6">Nuestro Compromiso</h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {valores.map((valor: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-4">{valor.icon}</div>
                <h3 className="text-xl font-bold mb-3">{valor.title}</h3>
                <p className="text-gray-400 leading-relaxed">{valor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
