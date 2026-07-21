export default function PrivacidadPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Políticas de Privacidad</h1>
      
      <div className="prose prose-lg text-gray-700">
        <p className="mb-6">
          En <strong>Chileflor</strong>, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos su información personal cuando visita nuestro sitio web o utiliza nuestros servicios.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Información que recopilamos</h2>
        <p className="mb-4">
          Recopilamos información que usted nos proporciona directamente al crear una cuenta, realizar un pedido, suscribirse a nuestro boletín o contactarnos. Esta información puede incluir:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Nombre completo</li>
          <li>Dirección de correo electrónico</li>
          <li>Número de teléfono (WhatsApp)</li>
          <li>Dirección de envío y facturación</li>
          <li>Información de la dedicatoria o mensaje adjunto a los pedidos</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso de la información</h2>
        <p className="mb-4">
          Utilizamos la información recopilada para:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Procesar y entregar sus pedidos de arreglos florales.</li>
          <li>Comunicarnos con usted sobre su pedido, incluyendo confirmaciones y actualizaciones de entrega.</li>
          <li>Proveer soporte al cliente.</li>
          <li>Mejorar nuestros servicios y sitio web.</li>
          <li>Gestionar los beneficios del <strong>Club Chileflor</strong>.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Protección de su información</h2>
        <p className="mb-6">
          Implementamos medidas de seguridad para mantener la seguridad de su información personal. No vendemos, intercambiamos ni transferimos a terceros su información de identificación personal, excepto a proveedores de servicios de confianza (como servicios logísticos o pasarelas de pago) que nos asisten en la operación de nuestro sitio web o en la prestación de servicios, siempre y cuando estas partes acuerden mantener esta información confidencial.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Contenido de las Dedicatorias y Códigos QR</h2>
        <p className="mb-6">
          Entendemos que los mensajes y archivos multimedia (fotos/videos) asociados a los Códigos QR de las dedicatorias son de naturaleza sensible y personal. Estos archivos se almacenan de manera encriptada y solo pueden ser accedidos mediante el escaneo físico del código QR o el enlace directo.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contacto</h2>
        <p className="mb-6">
          Si tiene alguna pregunta sobre esta Política de Privacidad, puede contactarnos en <strong>hola@chileflor.cl</strong>.
        </p>
      </div>
    </div>
  );
}
