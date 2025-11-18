
import React, { useMemo } from 'react';
import { Sale } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, PresentationChartIcon, TargetIcon } from './icons';

interface StrategicDashboardProps {
  data: Sale[];
  monthlyGoal: number;
}

const KPICard: React.FC<{ title: string; value: string; subtext?: string; icon: React.ReactNode; trend?: 'up' | 'down' | 'neutral' }> = ({ title, value, subtext, icon, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      {subtext && <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>{subtext}</p>}
    </div>
    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
      {icon}
    </div>
  </div>
);

const StrategicDashboard: React.FC<StrategicDashboardProps> = ({ data, monthlyGoal }) => {
  
  const metrics = useMemo(() => {
    const totalSales = data.length;
    const closedSales = data.filter(s => s.status === 'Fechado');
    const lostSales = data.filter(s => s.status === 'Perdido');
    const activeSales = data.filter(s => s.status === 'Ativo');
    
    const totalRevenue = closedSales.reduce((acc, curr) => acc + curr.valorVenda, 0);
    const lostRevenue = lostSales.reduce((acc, curr) => acc + curr.valorVenda, 0); // Using valorVenda as potential value lost
    const pipelineValue = activeSales.reduce((acc, curr) => acc + (curr.valorVenda || curr.valorInicial), 0);

    const closedCount = closedSales.length;
    const lostCount = lostSales.length;
    const completedCount = closedCount + lostCount;
    
    const conversionRate = completedCount > 0 ? (closedCount / completedCount) * 100 : 0;
    const averageTicket = closedCount > 0 ? totalRevenue / closedCount : 0;

    // Current Month Revenue for Goal
    const currentDate = new Date();
    const currentMonthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM
    const currentMonthRevenue = data
        .filter(s => s.status === 'Fechado' && s.dataCadastro.startsWith(currentMonthStr))
        .reduce((acc, curr) => acc + curr.valorVenda, 0);
    
    const goalProgress = monthlyGoal > 0 ? (currentMonthRevenue / monthlyGoal) * 100 : 0;

    // Funnel Data
    const stages = ['Lead', 'Prospecção', 'Negociação', 'Fechamento'];
    const funnelData = stages.map(stage => {
        const count = data.filter(s => s.etapaFunil === stage).length;
        const value = data.filter(s => s.etapaFunil === stage).reduce((acc, s) => acc + (s.valorVenda || s.valorInicial), 0);
        return { stage, count, value };
    });

    // Sales by Category
    const categories = Array.from(new Set(data.map(s => s.categoria)));
    const categoryData = categories.map(cat => {
        const count = data.filter(s => s.categoria === cat && s.status === 'Fechado').length;
        return { name: cat, count };
    }).sort((a, b) => b.count - a.count);
    
    // Sales by Unit
    const units = Array.from(new Set(data.map(s => s.unidade)));
    const unitData = units.map(u => {
        const revenue = data.filter(s => s.unidade === u && s.status === 'Fechado').reduce((acc, s) => acc + s.valorVenda, 0);
        return { name: u, revenue };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
        totalRevenue,
        currentMonthRevenue,
        goalProgress,
        lostRevenue,
        pipelineValue,
        conversionRate,
        averageTicket,
        funnelData,
        categoryData,
        unitData
    };
  }, [data, monthlyGoal]);

  return (
    <div className="space-y-6">
      {/* Goal Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
          <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <TargetIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-gray-800">Meta Mensal</h3>
                      <p className="text-sm text-gray-500">Mês atual vs Objetivo</p>
                  </div>
              </div>
              <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{metrics.goalProgress.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Atingido</p>
              </div>
          </div>
          
          <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">{metrics.currentMonthRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <span className="font-semibold text-gray-500">Meta: {monthlyGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-indigo-100">
                  <div 
                    style={{ width: `${Math.min(metrics.goalProgress, 100)}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                        metrics.goalProgress >= 100 ? 'bg-green-500' : 
                        metrics.goalProgress >= 70 ? 'bg-indigo-500' : 
                        metrics.goalProgress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  ></div>
              </div>
          </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
            title="Receita Total (Acumulada)" 
            value={metrics.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            icon={<CurrencyDollarIcon />}
            subtext="+12% vs mês anterior (Simulado)"
            trend="up"
        />
        <KPICard 
            title="Taxa de Conversão Global" 
            value={`${metrics.conversionRate.toFixed(1)}%`} 
            icon={<PresentationChartIcon />}
            subtext="Considerando ganhos vs perdidos"
            trend="neutral"
        />
        <KPICard 
            title="Ticket Médio" 
            value={metrics.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            icon={<ChartBarIcon />}
            subtext="Média por venda fechada"
        />
        <KPICard 
            title="Valor em Pipeline" 
            value={metrics.pipelineValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            icon={<CurrencyDollarIcon />}
            subtext="Potencial em aberto"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Saúde do Funil de Vendas</h3>
            <div className="space-y-4">
                {metrics.funnelData.map((step, index) => {
                    const maxVal = Math.max(...metrics.funnelData.map(d => d.count));
                    const widthPercentage = maxVal > 0 ? (step.count / maxVal) * 100 : 0;
                    
                    return (
                        <div key={step.stage} className="relative">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{step.stage}</span>
                                <span className="text-gray-500">{step.count} oportunidades ({step.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4">
                                <div 
                                    className={`h-4 rounded-full transition-all duration-500 ${
                                        index === 0 ? 'bg-blue-400' : 
                                        index === 1 ? 'bg-indigo-500' : 
                                        index === 2 ? 'bg-purple-500' : 
                                        'bg-green-500'
                                    }`} 
                                    style={{ width: `${widthPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Category Distribution (Donut Chart Simulation) */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Vendas Fechadas por Categoria</h3>
            <div className="flex-1 flex items-center justify-center relative">
                {/* Simple CSS/SVG Donut Chart */}
                <svg viewBox="0 0 36 36" className="w-48 h-48 transform -rotate-90">
                    {/* Background Circle */}
                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    
                    {/* Segments - Just visualizing top 3 for demo simplicity in SVG */}
                    {metrics.categoryData.length > 0 && (
                         <path className="text-indigo-600" strokeDasharray={`${(metrics.categoryData[0].count / metrics.categoryData.reduce((a,b)=>a+b.count,0)) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    )}
                </svg>
                <div className="absolute text-center">
                    <span className="text-3xl font-bold text-gray-800">{metrics.categoryData.reduce((a,b)=>a+b.count,0)}</span>
                    <p className="text-xs text-gray-500">Vendas</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                {metrics.categoryData.map((cat, idx) => (
                    <div key={cat.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${idx === 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                            <span className="text-gray-600">{cat.name}</span>
                        </div>
                        <span className="font-bold text-gray-800">{cat.count}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Performance by Unit */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Receita Gerada por Unidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.unitData.map((unit, index) => (
                <div key={unit.name} className="border border-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">{unit.name}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-indigo-100 text-indigo-700`}>
                            #{index + 1}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{unit.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                        <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(unit.revenue / metrics.unitData[0].revenue) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicDashboard;
