import { redirect } from 'next/navigation';

// El panel logístico fue integrado al CRM de agentes.
// Redirigimos para no romper links existentes.
export default function LogisticaRedirect() {
  redirect('/agentes/dashboard/logistica');
}
