
import React, { useState } from 'react';
import type { Sale } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SalesTableProps {
  data: Sale[];
}

const ITEMS_PER_PAGE = 5;

const SalesTable: React.FC<SalesTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };
  
  const getEtapaFunilColor = (etapa: string) => {
    switch (etapa) {
      case 'Lead': return 'bg-blue-100 text-blue-800';
      case 'Prospecção': return 'bg-purple-100 text-purple-800';
      case 'Negociação': return 'bg-yellow-100 text-yellow-800';
      case 'Fechamento': return 'bg-green-100 text-green-800';
      case 'Perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalhes das Vendas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Cadastro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa do Funil</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(sale.dataCadastro + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.vendedor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.nomeCliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEtapaFunilColor(sale.etapaFunil)}`}>
                      {sale.etapaFunil}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">Nenhum resultado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300">
            <ChevronLeftIcon />
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300">
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
