
import React, { useState, useMemo } from 'react';
import { Sale, Seller } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, TrendingUpIcon, CheckCircleIcon } from './icons';

interface PerformanceDashboardProps {
  data: Sale[];
  sellers: Seller[];
}

const PerformanceCard: React.FC<{ title: string; value: string; subtext?: string; icon: React.ReactNode; colorClass?: string }> = ({ title, value, subtext, icon, colorClass = "bg-blue-100 text-blue-600" }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      {icon}
    </div>
  </div>
);

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ data, sellers }) => {
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredData = useMemo(() => {
    return data.filter(sale => {
      const matchesSeller = selectedSeller ? sale.vendedor === selectedSeller : true;
      const matchesStart = startDate ? sale.dataCadastro >= startDate : true;
      const matchesEnd = endDate ? sale.dataCadastro <= endDate : true;
      return matchesSeller && matchesStart && matchesEnd;
    });
  }, [data, selectedSeller, startDate, endDate]);

  const metrics = useMemo(() => {
    const totalSales = filteredData.filter(s => s.status === 'Fechado').reduce((acc, curr) => acc + curr.valorVenda, 0);
    const salesCount = filteredData.filter(s => s.status === 'Fechado').length;
    const totalDeals = filteredData.length;
    const conversionRate = totalDeals > 0 ? (salesCount / totalDeals) * 100 : 0;
    const averageTicket = salesCount > 0 ? totalSales / salesCount : 0;

    // Group by month for chart
    const salesByDate = filteredData.reduce((acc, sale) => {
        const date = sale.dataCadastro; 
        if (!acc[date]) acc[date] = 0;
        if (sale.status === 'Fechado') {
            acc[date] += sale.valorVenda;
        }
        return acc;
    }, {} as {[key: string]: number});
    
    const chartData = Object.entries(salesByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, value]) => ({ date: new Date(date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}), value }));

    // Top Products
    const products = filteredData.reduce((acc: Record<string, number>, sale) => {
        if (sale.status === 'Fechado') {
            acc[sale.categoria] = (acc[sale.categoria] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(products).sort((a, b) => (b[1] as number) - (a[1] as number));

    return {
        totalSales,
        salesCount,
        conversionRate,
        averageTicket,
        chartData,
        topProducts
    };
  }, [filteredData]);

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vendedor</label>
                <select 
                    value={selectedSeller} 
                    onChange={(e) => setSelectedSeller(e.target.value)}
                    className="block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                >
                    <option value="">Todos os Vendedores</option>
                    {sellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data Início</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data Fim</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                />
            </div>
        </div>
        <div>
            <button 
                onClick={() => {setSelectedSeller(''); setStartDate(''); setEndDate('')}}
                className="text-sm text-gray-500 hover:text-indigo-600 underline"
            >
                Limpar Filtros
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceCard 
            title="Volume de Vendas (Fechado)" 
            value={metrics.totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            icon={<CurrencyDollarIcon />}
            colorClass="bg-green-100 text-green-600"
        />
        <PerformanceCard 
            title="Quantidade de Vendas" 
            value={metrics.salesCount.toString()} 
            icon={<CheckCircleIcon />}
            colorClass="bg-indigo-100 text-indigo-600"
        />
        <PerformanceCard 
            title="Taxa de Conversão" 
            value={`${metrics.conversionRate.toFixed(1)}%`} 
            subtext="Vendas Fechadas / Total de Leads"
            icon={<TrendingUpIcon />}
            colorClass="bg-purple-100 text-purple-600"
        />
        <PerformanceCard 
            title="Ticket Médio" 
            value={metrics.averageTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            icon={<ChartBarIcon />}
            colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Evolution Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Evolução de Vendas no Período</h3>
            {metrics.chartData.length > 0 ? (
                <div className="h-64 flex items-end justify-between space-x-2">
                    {metrics.chartData.map((data, index) => {
                        const maxVal = Math.max(...metrics.chartData.map(d => d.value));
                        const heightPercent = maxVal > 0 ? (data.value / maxVal) * 100 : 0;
                        return (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="relative w-full flex justify-center items-end h-full">
                                    <div 
                                        className="w-full max-w-[40px] bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all duration-300 relative"
                                        style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                            {data.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2 rotate-0 md:-rotate-45 origin-top-left md:mt-4 md:mb-2">{data.date}</span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded">
                    Sem vendas fechadas neste período.
                </div>
            )}
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
                {metrics.topProducts.length > 0 ? (
                    metrics.topProducts.map(([cat, count], index) => (
                        <div key={cat} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                            <div className="flex items-center">
                                <span className={`
                                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3
                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-200 text-gray-700' : index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-white border text-gray-500'}
                                `}>
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-700">{cat}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{count} vendas</span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Nenhuma venda registrada.</p>
                )}
            </div>
        </div>
      </div>

      {/* Quick List of Recent Deals */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Últimas Negociações do Período</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        {!selectedSeller && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.slice(0, 10).map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.dataCadastro).toLocaleDateString('pt-BR')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.nomeCliente}</td>
                            {!selectedSeller && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.vendedor}</td>}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${sale.status === 'Fechado' ? 'bg-green-100 text-green-800' : 
                                      sale.status === 'Perdido' ? 'bg-red-100 text-red-800' : 
                                      'bg-blue-100 text-blue-800'}`}>
                                    {sale.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sale.valorVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                        </tr>
                    ))}
                    {filteredData.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nenhum dado encontrado para os filtros selecionados.</td></tr>
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
