
import React from 'react';
import type { Sale, Unit, Seller } from '../types';
import { ChartBarIcon, CurrencyDollarIcon, UsersIcon } from './icons';

interface DashboardProps {
  data: Sale[];
  units: Unit[];
  sellers: Seller[];
}

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ data, units, sellers }) => {
  const totalVendas = data.reduce((sum, sale) => sum + sale.valorVenda, 0);
  const totalClientes = new Set(data.map(sale => sale.nomeCliente)).size;
  const leadsCount = data.filter(sale => sale.etapaFunil === 'Lead').length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
              <option value="">Unidade</option>
              {units.map(unit => <option key={unit.id} value={unit.name}>{unit.name}</option>)}
          </select>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
              <option value="">Vendedor</option>
              {sellers.map(seller => <option key={seller.id} value={seller.name}>{seller.name}</option>)}
          </select>
          <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Data Cadastro" />
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
            <option value="">Categoria</option>
            <option>Produto A</option>
            <option>Produto B</option>
            <option>Serviço X</option>
            <option>Serviço Y</option>
          </select>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
            <option value="">Etapa do Funil</option>
            <option>Lead</option>
            <option>Prospecção</option>
            <option>Negociação</option>
            <option>Fechamento</option>
            <option>Perdido</option>
          </select>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Nome do Cliente" />
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
            <option value="">Origem</option>
            <option>Website</option>
            <option>Indicação</option>
            <option>Feira</option>
            <option>Anúncio</option>
          </select>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Agendamento"/>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="">
            <option value="">Status</option>
            <option>Ativo</option>
            <option>Fechado</option>
            <option>Perdido</option>
          </select>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Valor Total de Vendas" 
          value={totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          icon={<CurrencyDollarIcon />} 
        />
        <DashboardCard 
          title="Clientes Únicos" 
          value={totalClientes.toString()} 
          icon={<UsersIcon />} 
        />
        <DashboardCard 
          title="Novos Leads" 
          value={leadsCount.toString()} 
          icon={<ChartBarIcon />} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
