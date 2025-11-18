
import React, { useState, useEffect } from 'react';
import { Sale } from '../types';
import { 
    ChevronLeftIcon, 
    ClockIcon, 
    MailIcon, 
    CheckCircleIcon, 
    CubeIcon, 
    DocumentTextIcon, 
    PaperClipIcon, 
    CreditCardIcon,
    PhoneIcon,
    StarIcon,
    CloseIcon,
    UsersIcon
} from './icons';

interface SaleDetailModalProps {
  isOpen: boolean;
  sale: Sale;
  onClose: () => void;
  onSave: (updatedSale: Sale) => void;
}

const tabs = [
    { id: 'history', label: 'Histórico', icon: <ClockIcon /> },
    { id: 'email', label: 'E-mail', icon: <MailIcon /> },
    { id: 'tasks', label: 'Tarefas', icon: <CheckCircleIcon /> },
    { id: 'products', label: 'Produtos e Serviços', icon: <CubeIcon /> },
    { id: 'files', label: 'Arquivos', icon: <PaperClipIcon /> },
    { id: 'proposals', label: 'Propostas', icon: <DocumentTextIcon /> },
    { id: 'payments', label: 'Pagamentos', icon: <CreditCardIcon /> },
];

const SaleDetailModal: React.FC<SaleDetailModalProps> = ({ isOpen, sale, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [formData, setFormData] = useState<Sale>(sale);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
      setFormData(sale);
  }, [sale]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsEditing(true);
  };

  const handleStarClick = (rating: number) => {
      setFormData(prev => ({ ...prev, qualificacao: rating as any }));
      setIsEditing(true);
  }

  const handleSave = () => {
      onSave(formData);
      setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center space-x-4">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{formData.nomeCliente}</h2>
                    <p className="text-xs text-gray-500">ID: {formData.id} • {formData.etapaFunil}</p>
                </div>
            </div>
            <div className="flex space-x-2">
                {isEditing && (
                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm">
                        Salvar Alterações
                    </button>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <CloseIcon className="h-6 w-6" />
                </button>
            </div>
        </div>

        {/* Main Content - Split View */}
        <div className="flex-1 overflow-hidden bg-gray-100 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* LEFT SIDE: Tabs & Content (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                    {/* Horizontal Tabs */}
                    <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab.id 
                                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Tab Content Area */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <div className="text-center text-gray-500 mt-10">
                            <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 inline-block">
                                <p className="text-lg font-medium">Conteúdo da aba: {tabs.find(t => t.id === activeTab)?.label}</p>
                                <p className="text-sm mt-2">Esta funcionalidade será implementada em breve.</p>
                            </div>
                            {/* Mock Content for History to show it's working */}
                            {activeTab === 'history' && (
                                <div className="mt-8 text-left max-w-lg mx-auto space-y-4">
                                    <div className="flex space-x-3">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">Venda Criada</p>
                                            <p className="text-xs text-gray-500">{new Date(formData.dataCadastro).toLocaleDateString('pt-BR')} às 10:00</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">Mudou para etapa: {formData.etapaFunil}</p>
                                            <p className="text-xs text-gray-500">Hoje às 14:30</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Negociação / Details (1/3 width) */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md flex flex-col overflow-y-auto">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Negociação</h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Header Info */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nome do Lead</label>
                            <input 
                                type="text" 
                                name="nomeCliente" 
                                value={formData.nomeCliente} 
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 font-medium focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Qualification */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Qualificação</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star} 
                                        onClick={() => handleStarClick(star)}
                                        className="focus:outline-none hover:scale-110 transition-transform"
                                    >
                                        <StarIcon 
                                            className={`w-6 h-6 ${star <= (formData.qualificacao || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                            filled={star <= (formData.qualificacao || 0)}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid for Numbers */}
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Data Cadastro</label>
                                <div className="p-2 bg-gray-100 rounded-md text-gray-700 text-sm border border-transparent">
                                    {new Date(formData.dataCadastro).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Previsão Fechamento</label>
                                <input 
                                    type="date" 
                                    name="previsaoFechamento"
                                    value={formData.previsaoFechamento || ''}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Valor Inicial</label>
                                <input 
                                    type="number" 
                                    name="valorInicial"
                                    value={formData.valorInicial}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Valor Venda</label>
                                <input 
                                    type="number" 
                                    name="valorVenda"
                                    value={formData.valorVenda}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm font-bold text-green-600 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-3 pt-4 border-t border-gray-100">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Origem</label>
                                <select 
                                    name="origem" 
                                    value={formData.origem} 
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option>Website</option>
                                    <option>Indicação</option>
                                    <option>Feira</option>
                                    <option>Anúncio</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cidade</label>
                                <input 
                                    type="text" 
                                    name="cidade"
                                    value={formData.cidade || ''}
                                    onChange={handleChange}
                                    placeholder="Cidade"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Endereço</label>
                                <input 
                                    type="text" 
                                    name="endereco"
                                    value={formData.endereco || ''}
                                    onChange={handleChange}
                                    placeholder="Endereço completo"
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                                <UsersIcon className="w-4 h-4 mr-2" />
                                Contatos
                            </h4>
                            <div className="space-y-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                                <div>
                                    <label className="text-xs text-gray-500 block">Telefone</label>
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-3 h-3 text-gray-400 mr-1" />
                                        <input 
                                            type="text" 
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="bg-transparent w-full text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">WhatsApp</label>
                                    <input 
                                        type="text" 
                                        name="whatsapp"
                                        value={formData.whatsapp || ''}
                                        onChange={handleChange}
                                        placeholder="WhatsApp"
                                        className="bg-transparent w-full text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">E-mail</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="email@exemplo.com"
                                        className="bg-transparent w-full text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1"
                                    />
                                </div>
                                 <div>
                                    <label className="text-xs text-gray-500 block">Redes Sociais</label>
                                    <input 
                                        type="text" 
                                        name="redesSociais"
                                        value={formData.redesSociais || ''}
                                        onChange={handleChange}
                                        placeholder="Instagram / LinkedIn"
                                        className="bg-transparent w-full text-sm border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SaleDetailModal;
