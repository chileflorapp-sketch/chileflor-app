export type Product = {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  description: string;
  price: number;
  image: string;
  flowers: string[]; // Key for flower-specific search
};

export const CATEGORIES = [
  'Ramos de Flores',
  'Ramos de Rosas',
  'Día de la Madre',
  'Día del Padre',
  'Bautizos',
  'Matrimonios',
  'Defunciones',
  'Ocasiones Especiales',
  'Amor',
  'Amistad',
  'Accesorios'
];

export const PRODUCTS: Product[] = [
  // 1. Ramos de Flores (8 productos)
  { id: '1-1', category: 'Ramos de Flores', name: 'Ramo Primavera', description: 'Ramo Primaveral con tulipanes y margaritas.', price: 35000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['tulipanes', 'margaritas'] },
  { id: '1-2', category: 'Ramos de Flores', name: 'Ramo Silvestre', description: 'Ramo Silvestre con flores de campo.', price: 32000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['silvestres'] },
  { id: '1-3', category: 'Ramos de Flores', name: 'Ramo Elegante', description: 'Ramo Elegante con lirios y astromelias.', price: 45000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['lirios', 'astromelias'] },
  { id: '1-4', category: 'Ramos de Flores', name: 'Ramo Minimalista', description: 'Ramo Minimalista con flores blancas.', price: 29000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['blancas'] },
  { id: '1-5', category: 'Ramos de Flores', name: 'Ramo Tropical', description: 'Ramo Tropical con aves del paraíso y heliconias.', price: 55000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['aves del paraíso', 'heliconias'] },
  { id: '1-6', category: 'Ramos de Flores', name: 'Ramo Campestre', description: 'Ramo Campestre con girasoles y lavanda.', price: 38000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['girasoles', 'lavanda'] },
  { id: '1-7', category: 'Ramos de Flores', name: 'Ramo Alegría', description: 'Ramo luminoso con gerberas variadas.', price: 28000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['gerberas'] },
  { id: '1-8', category: 'Ramos de Flores', name: 'Ramo Peonías', description: 'Delicado ramo con peonías rosadas importadas.', price: 49000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['peonías'] },

  // 2. Ramos de Rosas (8 productos)
  { id: '2-1', category: 'Ramos de Rosas', name: 'Ramo de Rosas Rojas', description: 'Ramo de Rosas Rojas clásico doce unidades.', price: 42000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas', 'rosas rojas'] },
  { id: '2-2', category: 'Ramos de Rosas', name: 'Ramo de Rosas Rosadas', description: 'Ramo de Rosas Rosadas en tonalidades pastel.', price: 40000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['rosas', 'rosas rosadas'] },
  { id: '2-3', category: 'Ramos de Rosas', name: 'Ramo de Rosas Blancas', description: 'Ramo de Rosas Blancas para ocasiones puras.', price: 41000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['rosas', 'rosas blancas'] },
  { id: '2-4', category: 'Ramos de Rosas', name: 'Ramo de Rosas Arcoíris', description: 'Ramo de Rosas Arcoíris con tintes especiales.', price: 48000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['rosas'] },
  { id: '2-5', category: 'Ramos de Rosas', name: 'Ramo de Rosas Eternas', description: 'Ramo de Rosas Eternas preservadas.', price: 65000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas'] },
  { id: '2-6', category: 'Ramos de Rosas', name: 'Ramo de Rosas con Follaje', description: 'Ramo de Rosas con Follaje Verde natural.', price: 39000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: ['rosas', 'follaje'] },
  { id: '2-7', category: 'Ramos de Rosas', name: 'Ramo de Rosas Amarillas', description: 'Rosas amarillas brillantes ideales para celebrar la vida.', price: 41000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: ['rosas amarillas', 'rosas'] },
  { id: '2-8', category: 'Ramos de Rosas', name: 'Ramo de Rosas Naranjas', description: 'Rosas naranjas vibrantes llenas de energía.', price: 42500, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['rosas naranjas', 'rosas'] },

  // 3. Día de la Madre (8 productos)
  { id: '3-1', category: 'Día de la Madre', name: 'Arreglo Maternal', description: 'Arreglo Maternal con rosas y claveles.', price: 45000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['rosas', 'claveles'] },
  { id: '3-2', category: 'Día de la Madre', name: 'Caja Premium', description: 'Caja de Flores Premium mezcla primavera.', price: 55000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '3-3', category: 'Día de la Madre', name: 'Ramo Abrazos de Mamá', description: 'Ramo Abrazos de Mamá flores suaves.', price: 38000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['suaves'] },
  { id: '3-4', category: 'Día de la Madre', name: 'Centro de Mesa Familiar', description: 'Centro de Mesa Familiar con velas.', price: 42000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['mixtas'] },
  { id: '3-5', category: 'Día de la Madre', name: 'Arreglo Personalizado', description: 'Arreglo con Dedicatoria Personalizada.', price: 49000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['mixtas'] },
  { id: '3-6', category: 'Día de la Madre', name: 'Pack Especial Madre', description: 'Pack Especial flores más chocolates y tarjeta.', price: 65000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['mixtas'] },
  { id: '3-7', category: 'Día de la Madre', name: 'Ramo Ternura Infinita', description: 'Combinación tierna de hortensias y margaritas.', price: 36000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['hortensias', 'margaritas'] },
  { id: '3-8', category: 'Día de la Madre', name: 'Canasta del Cariño', description: 'Hermosa canasta tejida con flores silvestres.', price: 58000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['silvestres'] },

  // 4. Día del Padre (8 productos)
  { id: '4-1', category: 'Día del Padre', name: 'Arreglo Masculino', description: 'Arreglo Masculino en tonos azules y verdes.', price: 45000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['follaje', 'azules'] },
  { id: '4-2', category: 'Día del Padre', name: 'Ramo Sobrio', description: 'Ramo Sobrio con anturios y follaje.', price: 40000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['anturios', 'follaje'] },
  { id: '4-3', category: 'Día del Padre', name: 'Caja Diseño Moderno', description: 'Caja de Flores diseño moderno minimalista.', price: 50000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '4-4', category: 'Día del Padre', name: 'Arreglo con Accesorio', description: 'Arreglo con Detalle de Accesorio.', price: 55000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '4-5', category: 'Día del Padre', name: 'Ramo de Girasoles', description: 'Ramo de Girasoles vibrante.', price: 35000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['girasoles'] },
  { id: '4-6', category: 'Día del Padre', name: 'Pack Especial Padre', description: 'Pack Especial flores más giftcard.', price: 70000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['mixtas'] },
  { id: '4-7', category: 'Día del Padre', name: 'Caja Cervecera Floral', description: 'Arreglo floral sobrio acompañado de cervezas artesanales.', price: 62000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['follaje', 'suculentas'] },
  { id: '4-8', category: 'Día del Padre', name: 'Arreglo Bonsai', description: 'Elegante arbolito Bonsai de fácil cuidado.', price: 75000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['bonsai', 'follaje'] },

  // 5. Bautizos (8 productos)
  { id: '5-1', category: 'Bautizos', name: 'Arreglo Angelical', description: 'Arreglo Angelical flores blancas detalles dorados.', price: 42000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['blancas'] },
  { id: '5-2', category: 'Bautizos', name: 'Centro Bautizo', description: 'Centro de Mesa para Bautizo con velas.', price: 45000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['blancas'] },
  { id: '5-3', category: 'Bautizos', name: 'Ramo del Ahijado', description: 'Ramo del Ahijado flores pequeñas y tiernas.', price: 30000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['pequeñas', 'blancas'] },
  { id: '5-4', category: 'Bautizos', name: 'Cruz Floral', description: 'Arreglo con Cruz Floral decorativa.', price: 55000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['blancas', 'mixtas'] },
  { id: '5-5', category: 'Bautizos', name: 'Caja de Recuerdos', description: 'Caja de Recuerdos flores preservadas.', price: 60000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['preservadas'] },
  { id: '5-6', category: 'Bautizos', name: 'Pack Bienvenida', description: 'Pack de Bienvenida arreglo más recordatorios.', price: 75000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['mixtas'] },
  { id: '5-7', category: 'Bautizos', name: 'Corona Pureza', description: 'Pequeña corona de flores blancas puras.', price: 40000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['blancas'] },
  { id: '5-8', category: 'Bautizos', name: 'Detalle de Padrinos', description: 'Arreglo sutil con cinta blanca.', price: 38000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['blancas', 'rosas'] },

  // 6. Matrimonios (8 productos)
  { id: '6-1', category: 'Matrimonios', name: 'Ramo de Novia', description: 'Ramo de Novia Profesional personalizable.', price: 85000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['rosas', 'blancas'] },
  { id: '6-2', category: 'Matrimonios', name: 'Centro Banquete', description: 'Centro de Mesa para Banquete con velas y cristales.', price: 65000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['rosas'] },
  { id: '6-3', category: 'Matrimonios', name: 'Arreglo para Altar', description: 'Arreglo para Altar o Ceremonia.', price: 120000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['mixtas'] },
  { id: '6-4', category: 'Matrimonios', name: 'Ramo Damas de Honor', description: 'Ramo de Damas de Honor miniatura.', price: 25000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['mixtas'] },
  { id: '6-5', category: 'Matrimonios', name: 'Decoración Auto', description: 'Decoración Floral para Auto Nupcial.', price: 45000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['rosas', 'follaje'] },
  { id: '6-6', category: 'Matrimonios', name: 'Pack Aniversario', description: 'Pack de Aniversario con rosas.', price: 80000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas'] },
  { id: '6-7', category: 'Matrimonios', name: 'Bolsa de Pétalos', description: 'Pétalos de rosa frescos para lanzar o decorar.', price: 15000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['rosas', 'pétalos'] },
  { id: '6-8', category: 'Matrimonios', name: 'Boutonniere del Novio', description: 'Prendedor floral elegante para traje de novio.', price: 12000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: ['rosas', 'mini'] },

  // 7. Defunciones (8 productos)
  { id: '7-1', category: 'Defunciones', name: 'Corona Fúnebre', description: 'Corona Fúnebre Clásica flores blancas.', price: 150000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['blancas'] },
  { id: '7-2', category: 'Defunciones', name: 'Arreglo Cementerio', description: 'Arreglo para Cementerio base de espuma.', price: 45000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['mixtas'] },
  { id: '7-3', category: 'Defunciones', name: 'Centro Condolencias', description: 'Centro de Condolencias lirios y crisantemos.', price: 55000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['lirios', 'crisantemos'] },
  { id: '7-4', category: 'Defunciones', name: 'Ramo de Despedida', description: 'Ramo de Despedida flores moradas y blancas.', price: 40000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['blancas', 'moradas'] },
  { id: '7-5', category: 'Defunciones', name: 'Cruz Floral Servicio', description: 'Cruz Floral para Servicio.', price: 85000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['mixtas'] },
  { id: '7-6', category: 'Defunciones', name: 'Arreglo Lápida', description: 'Arreglo para Lápida con soporte.', price: 50000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '7-7', category: 'Defunciones', name: 'Cesta del Recuerdo', description: 'Cesta floral respetuosa en tonos sepia y blanco.', price: 60000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['crisantemos'] },
  { id: '7-8', category: 'Defunciones', name: 'Cojín Floral', description: 'Cojín de flores para acompañar el féretro.', price: 90000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['blancas', 'rosas'] },

  // 8. Ocasiones Especiales (8 productos)
  { id: '8-1', category: 'Ocasiones Especiales', name: 'Arreglo Graduación', description: 'Arreglo para Graduación colores institucionales.', price: 40000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['mixtas'] },
  { id: '8-2', category: 'Ocasiones Especiales', name: 'Ramo Cumpleaños', description: 'Ramo de Cumpleaños mezcla colorida.', price: 35000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas', 'coloridas'] },
  { id: '8-3', category: 'Ocasiones Especiales', name: 'Centro Cena Formal', description: 'Centro de Mesa para Cena Formal.', price: 50000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['elegantes'] },
  { id: '8-4', category: 'Ocasiones Especiales', name: 'Arreglo Baby Shower', description: 'Arreglo para Baby Shower tonos pastel.', price: 45000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['pastel'] },
  { id: '8-5', category: 'Ocasiones Especiales', name: 'Ramo Aniversario Laboral', description: 'Ramo de Aniversario Laboral corporativo.', price: 38000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['corporativas'] },
  { id: '8-6', category: 'Ocasiones Especiales', name: 'Arreglo Jubilación', description: 'Arreglo para Jubilación conmemorativo.', price: 55000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '8-7', category: 'Ocasiones Especiales', name: 'Arreglo Nacimiento', description: 'Arreglo floral suave con osito de peluche.', price: 62000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['pastel'] },
  { id: '8-8', category: 'Ocasiones Especiales', name: 'Corona Triunfo', description: 'Corona floral decorativa para logros deportivos o metas.', price: 45000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['laureles', 'rosas'] },

  // 9. Amor (8 productos)
  { id: '9-1', category: 'Amor', name: 'Ramo San Valentín', description: 'Ramo de San Valentín rosas rojas y corazones.', price: 55000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas', 'rosas rojas'] },
  { id: '9-2', category: 'Amor', name: 'Arreglo Sorpresa', description: 'Arreglo Sorpresa con velas aromáticas.', price: 48000, image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800', flowers: ['rosas'] },
  { id: '9-3', category: 'Amor', name: 'Caja Amor Oculto', description: 'Caja de Flores con mensaje de amor oculto.', price: 60000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['rosas'] },
  { id: '9-4', category: 'Amor', name: 'Ramo Aniversario Novios', description: 'Ramo de Aniversario de Novios combinación especial.', price: 50000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: ['rosas'] },
  { id: '9-5', category: 'Amor', name: 'Desayuno Sorpresa', description: 'Desayuno Sorpresa flores y frutas.', price: 45000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['mixtas'] },
  { id: '9-6', category: 'Amor', name: 'Pack Reconciliación', description: 'Pack de Reconciliación rosas y peluche.', price: 65000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['rosas'] },
  { id: '9-7', category: 'Amor', name: 'Caja Corazón Premium', description: 'Rosas dispuestas en una elegante caja en forma de corazón.', price: 75000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas rojas'] },
  { id: '9-8', category: 'Amor', name: 'Ramo Pasión y Sabor', description: 'Ramo de rosas rojas rodeadas de bombones finos.', price: 68000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['rosas'] },

  // 10. Amistad (8 productos)
  { id: '10-1', category: 'Amistad', name: 'Ramo de la Amistad', description: 'Ramo de la Amistad girasoles y margaritas.', price: 30000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['girasoles', 'margaritas'] },
  { id: '10-2', category: 'Amistad', name: 'Arreglo Agradecimiento', description: 'Arreglo Agradecimiento flores mixtas.', price: 35000, image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800', flowers: ['mixtas'] },
  { id: '10-3', category: 'Amistad', name: 'Caja Mejor Amiga', description: 'Caja de Flores para Mejor Amiga con detalles.', price: 42000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas', 'rosadas'] },
  { id: '10-4', category: 'Amistad', name: 'Ramo Cumple Amigo', description: 'Ramo de Cumpleaños de Amigo colores vibrantes.', price: 28000, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: ['vibrantes'] },
  { id: '10-5', category: 'Amistad', name: 'Pack Compañerismo', description: 'Pack de Compañerismo flores más chocolate.', price: 45000, image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800', flowers: ['mixtas'] },
  { id: '10-6', category: 'Amistad', name: 'Arreglo Decir Gracias', description: 'Arreglo para Decir Gracias con nota.', price: 32000, image: 'https://images.unsplash.com/photo-1528699633788-424224dc89b5?q=80&w=800', flowers: ['mixtas'] },
  { id: '10-7', category: 'Amistad', name: 'Canasta de Risas', description: 'Flores amarillas y naranjas para iluminar su día.', price: 34000, image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800', flowers: ['girasoles', 'amarillas'] },
  { id: '10-8', category: 'Amistad', name: 'Arreglo Vínculo Eterno', description: 'Suculentas y flores duraderas en maceta.', price: 29000, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800', flowers: ['suculentas'] },

  // 11. Accesorios (8 productos)
  { id: '11-1', category: 'Accesorios', subCategory: 'Chocolates', name: 'Caja Chocolates Artesanales', description: 'Caja de Chocolates Artesanales relleno de frutas.', price: 12000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: [] },
  { id: '11-2', category: 'Accesorios', subCategory: 'Chocolates', name: 'Tableta Chocolate Belga', description: 'Tableta de Chocolate Belga con frutos secos.', price: 8900, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: [] },
  { id: '11-3', category: 'Accesorios', subCategory: 'Chocolates', name: 'Bombones Finos', description: 'Bombones Finos en caja de regalo.', price: 15000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: [] },
  { id: '11-4', category: 'Accesorios', subCategory: 'Peluches', name: 'Oso Clásico', description: 'Oso de Peluche Clásico diferentes tamaños.', price: 15990, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: [] },
  { id: '11-5', category: 'Accesorios', subCategory: 'Peluches', name: 'Peluche Personalizado', description: 'Peluche Personalizado con bordado.', price: 19990, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', flowers: [] },
  { id: '11-6', category: 'Accesorios', subCategory: 'Otros', name: 'Velas Aromáticas', description: 'Velas Aromáticas Artesanales.', price: 9990, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800', flowers: [] },
  { id: '11-7', category: 'Accesorios', subCategory: 'Otros', name: 'Vino Reserva', description: 'Botella de Vino Cabernet Sauvignon reserva.', price: 14990, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800', flowers: [] },
  { id: '11-8', category: 'Accesorios', subCategory: 'Chocolates', name: 'Trufas Cacao 80%', description: 'Selección de exquisitas trufas de cacao amargo.', price: 18000, image: 'https://images.unsplash.com/photo-1586521995568-39abaa0c2311?q=80&w=800', flowers: [] },
];
