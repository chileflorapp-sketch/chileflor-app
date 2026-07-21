export default function TerminosPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
      
      <div className="prose prose-lg text-gray-700">
        <p className="mb-6">
          Bienvenido a <strong>Chileflor</strong>. Al utilizar nuestro sitio web y nuestros servicios, usted acepta cumplir con los siguientes términos y condiciones. Lea detenidamente esta información antes de realizar una compra.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Uso del Servicio</h2>
        <p className="mb-4">
          Chileflor ofrece venta de arreglos florales, servicios de dedicatoria virtual (códigos QR) y planes de mantención de cementerios. Nos reservamos el derecho de rechazar el servicio, cancelar cuentas o cancelar pedidos a nuestra discreción, si creemos que la conducta del cliente viola las leyes aplicables o es perjudicial para nuestros intereses.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Políticas de Envío y Entrega</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Las entregas se realizarán en la fecha seleccionada durante el proceso de compra.</li>
          <li>En caso de no encontrar a nadie en el domicilio, intentaremos contactarlo. De no haber respuesta, el pedido será retornado a la tienda y se deberá coordinar un nuevo despacho con un costo adicional.</li>
          <li>Los envíos a cementerios requieren información precisa (Recinto, Sector, Lápida). Chileflor no se hace responsable por entregas fallidas debido a información incorrecta.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Políticas de Devolución y Reembolso</h2>
        <p className="mb-6">
          Debido a la naturaleza perecedera de nuestros productos (flores frescas), las solicitudes de reembolso o reemplazo solo se aceptarán si se notifican dentro de las 24 horas siguientes a la entrega y si el producto llegó en mal estado debido a nuestro manejo. No se aceptan devoluciones por "cambio de opinión".
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Club Chileflor (Programa de Lealtad)</h2>
        <p className="mb-6">
          Los puntos acumulados en el <strong>Club Chileflor</strong> son intransferibles y no canjeables por dinero en efectivo. Chileflor se reserva el derecho de modificar los beneficios de cada nivel (Semilla, Brote, Flor VIP) y las tasas de acumulación de puntos en cualquier momento.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Propiedad Intelectual</h2>
        <p className="mb-6">
          Todo el contenido de este sitio (textos, gráficos, logotipos, imágenes) es propiedad de Chileflor o de sus proveedores de contenido (Paco Floreria, Floreria Los Mellizos) y está protegido por las leyes de propiedad intelectual.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Modificaciones a los Términos</h2>
        <p className="mb-6">
          Nos reservamos el derecho de realizar cambios en nuestro sitio, políticas y estos Términos y Condiciones en cualquier momento. Su uso continuo del sitio confirmará su aceptación de dichos cambios.
        </p>
      </div>
    </div>
  );
}
