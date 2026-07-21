import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export type ClubTier = 'Semilla' | 'Brote' | 'Flor VIP';

export interface ClubData {
  points: number;
  tier: ClubTier;
  earningRate: number; // Porcentaje (ej: 0.01, 0.02, 0.05)
  validOrdersCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useClub(): ClubData {
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState<ClubTier>('Semilla');
  const [earningRate, setEarningRate] = useState(0.01);
  const [validOrdersCount, setValidOrdersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClubData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      
      if (!authData.user) {
        setIsLoading(false);
        return;
      }
      
      const { data: pedidos } = await supabase
        .from('pedidos')
        .select('puntos_ganados, puntos_usados, estado')
        .eq('user_id', authData.user.id);
        
      if (pedidos) {
        let earned = 0;
        let spent = 0;
        let count = 0;
        
        pedidos.forEach(p => {
          // Solo pedidos completados exitosamente otorgan puntos (y cuentan para el nivel)
          if (p.estado === 'pagado' || p.estado === 'entregado' || p.estado === 'completado') {
             earned += (p.puntos_ganados || 0);
             count += 1;
          }
          // Cualquier pedido que no haya sido rechazado o devuelto retiene puntos usados
          if (p.estado !== 'rechazado' && p.estado !== 'devuelto' && p.estado !== 'cancelado') {
             spent += (p.puntos_usados || 0);
          }
        });
        
        const calculatedPoints = Math.max(0, earned - spent);
        
        // Calcular nivel y tasa
        let currentTier: ClubTier = 'Semilla';
        let rate = 0.01;
        
        if (count >= 10) {
          currentTier = 'Flor VIP';
          rate = 0.05;
        } else if (count >= 3) {
          currentTier = 'Brote';
          rate = 0.02;
        }
        
        setPoints(calculatedPoints);
        setValidOrdersCount(count);
        setTier(currentTier);
        setEarningRate(rate);
      }
    } catch (error) {
      console.error("Error obteniendo datos del club:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClubData();
  }, []);

  return {
    points,
    tier,
    earningRate,
    validOrdersCount,
    isLoading,
    refresh: fetchClubData
  };
}
