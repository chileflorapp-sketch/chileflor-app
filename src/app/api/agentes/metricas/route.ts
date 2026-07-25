import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: pedidos, error: pedidosError } = await supabase
      .from('pedidos')
      .select('total, estado, created_at, detalles');

    const { count: totalProducts, error: productsError } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true });

    if (pedidosError) throw pedidosError;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let ventasDelMes = 0;
    let entregasExitosas = 0;
    const categoryCount: Record<string, number> = {};
    const weeklyVolume: Record<string, number> = {
      'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats: Record<string, { completados: number, pendientes: number }> = {};
    monthNames.forEach(m => monthlyStats[m] = { completados: 0, pendientes: 0 });

    pedidos?.forEach(pedido => {
      const date = new Date(pedido.created_at);
      const isCurrentMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      const isCompleted = pedido.estado === 'COMPLETADO' || pedido.estado === 'entregado';
      
      if (isCurrentMonth) {
        if (isCompleted) {
          ventasDelMes += Number(pedido.total) || 0;
          entregasExitosas++;
        }
        
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (weeklyVolume[dayStr] !== undefined) {
          weeklyVolume[dayStr]++;
        }

        if (pedido.detalles?.items && Array.isArray(pedido.detalles.items)) {
          pedido.detalles.items.forEach((item: any) => {
             const cat = item.categoria || 'Otros';
             categoryCount[cat] = (categoryCount[cat] || 0) + (Number(item.cantidad) || 1);
          });
        }
      }

      const monthStr = monthNames[date.getMonth()];
      if (isCompleted) {
        monthlyStats[monthStr].completados++;
      } else {
        monthlyStats[monthStr].pendientes++;
      }
    });

    const areaData = monthNames.slice(Math.max(0, currentMonth - 6), currentMonth + 1).map(name => ({
      name,
      completados: monthlyStats[name].completados,
      pendientes: monthlyStats[name].pendientes
    }));

    const barData = Object.keys(weeklyVolume).map(name => ({ name, tickets: weeklyVolume[name] }));

    let pieData = Object.keys(categoryCount).map(name => ({ name, value: categoryCount[name] })).sort((a, b) => b.value - a.value).slice(0, 4);
    if (pieData.length === 0) {
      pieData.push({ name: 'Sin Ventas', value: 100 });
    }

    return NextResponse.json({
      ventasDelMes,
      entregasExitosas,
      totalProducts: totalProducts || 0,
      areaData,
      barData,
      pieData
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
