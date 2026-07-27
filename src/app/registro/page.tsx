'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/mi-cuenta/registro');
  }, [router]);
  return null;
}
