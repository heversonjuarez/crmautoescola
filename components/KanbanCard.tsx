
import React from 'react';
import { Sale } from '../types';

interface KanbanCardProps {
  sale: Sale;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ sale, onDragStart, onClick }) => {
  return (
    <div 
        className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-indigo-300"
        draggable={!!onDragStart}
        onDragStart={onDragStart}
        onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-gray-800 truncate pr-2">{sale.nomeCliente}</p>
        {sale.qualificacao && (
             <span className="flex text-yellow-400 text-xs">
                ★ {sale.qualificacao}
             </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5 truncate">{sale.categoria}</p>
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm font-semibold text-green-600">
            {sale.valorVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
        <span className="text-xs text-gray-400 truncate max-w-[80px]" title={sale.vendedor}>{sale.vendedor}</span>
      </div>
    </div>
  );
};

export default KanbanCard;
