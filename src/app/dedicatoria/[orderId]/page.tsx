import DedicatoriaClient from './DedicatoriaClient';

export default async function CreaDedicatoriaPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <DedicatoriaClient orderId={orderId} />;
}
