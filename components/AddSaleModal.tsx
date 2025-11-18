
import React, { useState, useEffect } from 'react';
import { Sale, Unit, Seller } from '../types';
import { CloseIcon } from './icons';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSale: (newSaleData: Omit<Sale, 'id' | 'dataCadastro' | 'etapaFunil' | 'status'>) => void;
  units: Unit[];
  sellers: Seller[];
  unitSellerLinks: { [key: number]: number[] };
  existingPhones: string[];
}

const initialFormData = {
  unidade: '',
  vendedor: '',
  valorInicial: '',
  valorVenda: '',
  nomeCliente: '',
  telefone: '',
  categoria: 'Produto A' as Sale['categoria'],
  origem: 'Website' as Sale['origem'],
};

const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onAddSale,
  units,
  sellers,
  unitSellerLinks,
  existingPhones,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<typeof initialFormData>>({});
  const [availableSellers, setAvailableSellers] = useState<Seller[]>([]);

  useEffect(() => {
    if (formData.unidade) {
      const selectedUnit = units.find(u => u.name === formData.unidade);
      if (selectedUnit) {
        const linkedIds = unitSellerLinks[selectedUnit.id] || [];
        const filteredSellers = sellers.filter(s => linkedIds.includes(s.id));
        setAvailableSellers(filteredSellers);
      }
    } else {
      setAvailableSellers([]);
    }
    // Reset vendedor when unit changes
    setFormData(prev => ({...prev, vendedor: ''}));
  }, [formData.unidade, units, sellers, unitSellerLinks]);


  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<typeof initialFormData> = {};
    if (!formData.unidade) newErrors.unidade = 'Unidade é obrigatória';
    if (!formData.vendedor) newErrors.vendedor = 'Vendedor é obrigatório';
    if (!formData.nomeCliente) newErrors.nomeCliente = 'Nome do cliente é obrigatório';
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (existingPhones.includes(formData.telefone)) newErrors.telefone = 'Este telefone já está cadastrado';
    if (!formData.valorVenda) newErrors.valorVenda = 'Valor da venda é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const submissionData = {
          ...formData,
          valorInicial: parseFloat(formData.valorInicial) || 0,
          valorVenda: parseFloat(formData.valorVenda),
      };
      onAddSale(submissionData);
      setFormData(initialFormData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Adicionar Nova Venda</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Unidade *</label>
              <select name="unidade" value={formData.unidade} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.unidade ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Selecione...</option>
                {units.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
              {errors.unidade && <p className="text-xs text-red-500 mt-1">{errors.unidade}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendedor *</label>
              <select name="vendedor" value={formData.vendedor} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.vendedor ? 'border-red-500' : 'border-gray-300'}`} disabled={!formData.unidade}>
                <option value="">Selecione...</option>
                {availableSellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              {errors.vendedor && <p className="text-xs text-red-500 mt-1">{errors.vendedor}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Cliente *</label>
            <input type="text" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.nomeCliente ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.nomeCliente && <p className="text-xs text-red-500 mt-1">{errors.nomeCliente}</p>}
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Telefone *</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Inicial (R$)</label>
              <input type="number" name="valorInicial" value={formData.valorInicial} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Valor da Venda (R$) *</label>
              <input type="number" name="valorVenda" value={formData.valorVenda} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.valorVenda ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.valorVenda && <p className="text-xs text-red-500 mt-1">{errors.valorVenda}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option>Produto A</option>
                <option>Produto B</option>
                <option>Serviço X</option>
                <option>Serviço Y</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Origem</label>
              <select name="origem" value={formData.origem} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option>Website</option>
                <option>Indicação</option>
                <option>Feira</option>
                <option>Anúncio</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t mt-6 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
              Salvar Venda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSaleModal;
