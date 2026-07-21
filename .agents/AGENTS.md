# Reglas de Proyecto: Chileflor

<!-- BEGIN:chileflor-catalog-rules -->
## 1. Ficha Maestra de Producto
Cualquier producto nuevo debe integrarse respetando estos campos en el catálogo JSON:
- `id_sku`: Código interno (ej: `p-001`).
- `nombre_comercial`: Nombre de venta.
- `categoria_madre` & `subcategoria`: (ej: Flores > Ramos de Novia).
- `atributo_visual`: [Fondo Neutro / Close-up / Escala Humana / Cenital].
- `badge_activo`: [Ninguno / ⚡ Entrega Hoy / 💎 Premium / 🍃 Eco-Friendly].
- `cross_sell`: IDs de complementos.

## 2. Matriz de Modificación (Mantenimiento)
- **Fuera de Temporada:** NO borrar productos del catálogo. Cambiar el estado a `fuera_de_temporada` o `proximamente` (Para SEO).
- **Héroe de Categoría:** Rotar el badge `⚡ Disponible hoy` según stock real.

## 3. Regla de Oro de la Imagen (UI Guidelines)
Para mantener la armonía visual de la tienda:
- **Ramo Nuevo:** Fotografía OBLIGATORIA con luz natural lateral.
- **Regalo Nuevo:** Fotografía OBLIGATORIA en plano Cenital (desde arriba) para que se vea el interior.
- **Homenaje Nuevo:** Fondo OBLIGATORIAMENTE blanco o hueso para transmitir paz.
<!-- END:chileflor-catalog-rules -->
