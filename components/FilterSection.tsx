
import React from 'react';
import type { Filters, Unit, Seller } from '../types';
import { FilterIcon } from './icons';

interface FilterSectionProps {
  filters: Filters;
  onFilterChange: (filterName: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  units: Unit[];
  sellers: Seller[];
}

const FilterInput: React.FC<{
  name: keyof Filters;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  options?: { id: number | string, name: string }[];
}> = ({ name, placeholder, value, onChange, type = 'text', options }) => {
  if (type === 'select') {
    return (
      <select name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <option value="">{placeholder}</option>
        {options?.map(option => <option key={option.id} value={option.name}>{option.name}</option>)}
      </select>
    );
  }
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  );
};

const FilterSection: React.FC<FilterSectionProps> = ({ filters, onFilterChange, onClearFilters, units, sellers }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange(e.target.name as keyof Filters, e.target.value);
  };

  const staticOptions = {
    categoria: [{id: 1, name: 'Produto A'}, {id: 2, name: 'Produto B'}, {id: 3, name: 'Serviço X'}, {id: 4, name: 'Serviço Y'}],
    origem: [{id: 1, name: 'Website'}, {id: 2, name: 'Indicação'}, {id: 3, name: 'Feira'}, {id: 4, name: 'Anúncio'}],
    status: [{id: 1, name: 'Ativo'}, {id: 2, name: 'Fechado'}, {id: 3, name: 'Perdido'}],
    etapaFunil: [{id: 1, name: 'Lead'}, {id: 2, name: 'Prospecção'}, {id: 3, name: 'Negociação'}, {id: 4, name: 'Fechamento'}, {id: 5, name: 'Perdido'}],
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <FilterIcon />
        <h2 className="text-2xl font-bold text-gray-900 ml-2">Filtros</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <FilterInput name="unidade" placeholder="Unidade" value={filters.unidade} onChange={handleChange} type="select" options={units} />
        <FilterInput name="vendedor" placeholder="Vendedor" value={filters.vendedor} onChange={handleChange} type="select" options={sellers}/>
        <FilterInput name="dataCadastro" placeholder="Data Cadastro" value={filters.dataCadastro} onChange={handleChange} type="date" />
        <FilterInput name="valorInicial" placeholder="Valor Inicial" value={filters.valorInicial} onChange={handleChange} type="number" />
        <FilterInput name="valorVenda" placeholder="Valor da Venda" value={filters.valorVenda} onChange={handleChange} type="number" />
        <FilterInput name="nomeCliente" placeholder="Nome do Cliente" value={filters.nomeCliente} onChange={handleChange} />
        <FilterInput name="telefone" placeholder="Telefone" value={filters.telefone} onChange={handleChange} />
        <FilterInput name="categoria" placeholder="Categoria" value={filters.categoria} onChange={handleChange} type="select" options={staticOptions.categoria.map(o => ({...o, name: o.name}))} />
        <FilterInput name="origem" placeholder="Origem" value={filters.origem} onChange={handleChange} type="select" options={staticOptions.origem.map(o => ({...o, name: o.name}))} />
        <FilterInput name="status" placeholder="Status" value={filters.status} onChange={handleChange} type="select" options={staticOptions.status.map(o => ({...o, name: o.name}))} />
        <FilterInput name="etapaFunil" placeholder="Etapa do Funil" value={filters.etapaFunil} onChange={handleChange} type="select" options={staticOptions.etapaFunil.map(o => ({...o, name: o.name}))} />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
