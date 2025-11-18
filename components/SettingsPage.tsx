
import React, { useState, useEffect } from 'react';
import { Unit, Seller, UserRole, AIConfig, AITrainingData } from '../types';
import { 
    PencilIcon, 
    TrashIcon, 
    CheckCircleIcon, 
    CloseIcon, 
    UserGroupIcon, 
    ChartBarIcon, 
    RobotIcon, 
    BrainIcon,
    LinkIcon,
    PlusIcon,
    UploadIcon,
    DocumentTextIcon,
    TargetIcon
} from './icons';

interface SettingsPageProps {
  units: Unit[];
  sellers: Seller[];
  unitSellerLinks: { [key: number]: number[] };
  onAddUnit: (name: string) => void;
  onUpdateUnit: (id: number, name: string) => void;
  onToggleUnit: (id: number) => void;
  onDeleteUnit: (id: number) => void;
  onAddSeller: (name: string, email: string, phone: string, role: UserRole) => void;
  onUpdateSeller: (id: number, name: string, email: string, phone: string, role: UserRole) => void;
  onToggleSeller: (id: number) => void;
  onDeleteSeller: (id: number) => void;
  onUpdateLinks: (unitId: number, sellerIds: number[]) => void;
  monthlyGoal: number;
  onUpdateMonthlyGoal: (goal: number) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  units,
  sellers,
  unitSellerLinks,
  onAddUnit,
  onUpdateUnit,
  onToggleUnit,
  onDeleteUnit,
  onAddSeller,
  onUpdateSeller,
  onToggleSeller,
  onDeleteSeller,
  onUpdateLinks,
  monthlyGoal,
  onUpdateMonthlyGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'units' | 'distribution' | 'ai-integration' | 'ai-trainer' | 'goals'>('team');

  // --- Internal Component: Sidebar Navigation ---
  const TabButton: React.FC<{ 
      id: typeof activeTab, 
      label: string, 
      icon: React.ReactNode,
      description: string 
  }> = ({ id, label, icon, description }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full text-left p-4 flex items-start space-x-3 rounded-lg transition-colors mb-2 ${activeTab === id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
    >
      <div className={`p-2 rounded-md ${activeTab === id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <p className={`font-semibold ${activeTab === id ? 'text-indigo-900' : 'text-gray-700'}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </button>
  );

  // --- Internal Logic for Team/Sellers ---
  const [sellerForm, setSellerForm] = useState<{
      id: number | null,
      name: string,
      email: string,
      phone: string,
      role: UserRole
  }>({ id: null, name: '', email: '', phone: '', role: 'Equipe' });

  const handleEditSeller = (seller: Seller) => {
      setSellerForm({
          id: seller.id,
          name: seller.name,
          email: seller.email || '',
          phone: seller.phone || '',
          role: seller.role
      });
  };

  const handleSaveSeller = () => {
      if(!sellerForm.name) return;
      if (sellerForm.id) {
          onUpdateSeller(sellerForm.id, sellerForm.name, sellerForm.email, sellerForm.phone, sellerForm.role);
      } else {
          onAddSeller(sellerForm.name, sellerForm.email, sellerForm.phone, sellerForm.role);
      }
      setSellerForm({ id: null, name: '', email: '', phone: '', role: 'Equipe' });
  };
  
  const handleCancelSeller = () => {
    setSellerForm({ id: null, name: '', email: '', phone: '', role: 'Equipe' });
  }

  // --- Internal Logic for Units ---
  const [unitName, setUnitName] = useState('');
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  const handleSaveUnit = () => {
    if (!unitName.trim()) return;
    if (editingUnitId !== null) {
      onUpdateUnit(editingUnitId, unitName.trim());
      setEditingUnitId(null);
    } else {
      onAddUnit(unitName.trim());
    }
    setUnitName('');
  };

  // --- Internal Logic for Distribution ---
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [linkedSellerIds, setLinkedSellerIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (selectedUnitId !== null && unitSellerLinks[selectedUnitId]) {
      setLinkedSellerIds(new Set(unitSellerLinks[selectedUnitId]));
    } else {
      setLinkedSellerIds(new Set());
    }
  }, [selectedUnitId, unitSellerLinks]);

  const handleSellerLinkToggle = (sellerId: number) => {
    const newLinkedIds = new Set(linkedSellerIds);
    if (newLinkedIds.has(sellerId)) {
      newLinkedIds.delete(sellerId);
    } else {
      newLinkedIds.add(sellerId);
    }
    setLinkedSellerIds(newLinkedIds);
  };

  // --- Internal Logic for AI ---
  const [aiConfig, setAiConfig] = useState<AIConfig>({
      apiKey: '',
      model: 'gpt-4',
      temperature: 0.7,
      tone: 'Profissional'
  });
  const [aiTraining, setAiTraining] = useState<AITrainingData>({
      businessContext: '',
      uploadedFiles: []
  });

  // --- Internal Logic for Goals ---
  const [localGoal, setLocalGoal] = useState(monthlyGoal);
  const handleSaveGoal = () => {
      onUpdateMonthlyGoal(localGoal);
      alert('Meta atualizada com sucesso!');
  };


  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-white rounded-lg shadow overflow-hidden">
      
      {/* Left Sidebar for Settings Navigation */}
      <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">Geral</h2>
        <TabButton 
            id="team" 
            label="Usuários & Equipe" 
            icon={<UserGroupIcon className="w-5 h-5" />} 
            description="Gerencie perfis e acessos" 
        />
        <TabButton 
            id="units" 
            label="Unidades" 
            icon={<ChartBarIcon className="w-5 h-5" />} 
            description="Filiais e pontos de venda" 
        />
        <TabButton 
            id="distribution" 
            label="Distribuição de Equipe" 
            icon={<LinkIcon className="w-5 h-5" />} 
            description="Vincule vendedores às unidades" 
        />
        <TabButton 
            id="goals" 
            label="Metas & Objetivos" 
            icon={<TargetIcon className="w-5 h-5" />} 
            description="Definição de metas financeiras" 
        />
        
        <div className="border-t border-gray-200 my-4 pt-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-2">Inteligência</h2>
            <TabButton 
                id="ai-integration" 
                label="Mentor AI: Integração" 
                icon={<RobotIcon className="w-5 h-5" />} 
                description="Configuração do Modelo" 
            />
            <TabButton 
                id="ai-trainer" 
                label="Mentor AI: Treinador" 
                icon={<BrainIcon className="w-5 h-5" />} 
                description="Ensine a IA sobre seu negócio" 
            />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* --- TEAM MANAGEMENT TAB --- */}
        {activeTab === 'team' && (
            <div className="max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Gestão de Equipe</h2>
                        <p className="text-gray-500">Cadastre usuários e defina perfis de acesso.</p>
                    </div>
                </div>

                {/* Add/Edit Form */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{sellerForm.id ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input 
                                type="text" 
                                value={sellerForm.name}
                                onChange={e => setSellerForm({...sellerForm, name: e.target.value})}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil de Acesso</label>
                            <select 
                                value={sellerForm.role}
                                onChange={e => setSellerForm({...sellerForm, role: e.target.value as UserRole})}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Equipe">Equipe (Vendedor)</option>
                                <option value="Gestor">Gestor</option>
                                <option value="Master">Master (Admin)</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <input 
                                type="email" 
                                value={sellerForm.email}
                                onChange={e => setSellerForm({...sellerForm, email: e.target.value})}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <input 
                                type="text" 
                                value={sellerForm.phone}
                                onChange={e => setSellerForm({...sellerForm, phone: e.target.value})}
                                placeholder="(XX) XXXXX-XXXX"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        {sellerForm.id && (
                            <button onClick={handleCancelSeller} className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                Cancelar
                            </button>
                        )}
                        <button onClick={handleSaveSeller} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                            {sellerForm.id ? 'Salvar Alterações' : 'Adicionar Usuário'}
                        </button>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome / Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sellers.map(seller => (
                                <tr key={seller.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                {seller.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                                                <div className="text-sm text-gray-500">{seller.email || 'Sem e-mail'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            seller.role === 'Master' ? 'bg-purple-100 text-purple-800' :
                                            seller.role === 'Gestor' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {seller.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => onToggleSeller(seller.id)} className={`text-sm focus:outline-none ${seller.active ? 'text-green-600' : 'text-gray-400'}`}>
                                            {seller.active ? 'Ativo' : 'Inativo'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditSeller(seller)} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                        <button onClick={() => onDeleteSeller(seller.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- UNITS TAB --- */}
        {activeTab === 'units' && (
            <div className="max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Unidades de Negócio</h2>
                        <p className="text-gray-500">Gerencie as filiais e locais de operação.</p>
                    </div>
                </div>

                <div className="flex space-x-2 mb-6">
                    <input
                        type="text"
                        value={unitName}
                        onChange={(e) => setUnitName(e.target.value)}
                        placeholder="Nome da nova unidade"
                        className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button 
                        onClick={handleSaveUnit} 
                        className={`px-4 py-2 text-white font-semibold rounded-md transition-colors whitespace-nowrap ${editingUnitId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {editingUnitId ? 'Atualizar' : 'Adicionar'}
                    </button>
                    {editingUnitId && (
                        <button onClick={() => { setEditingUnitId(null); setUnitName(''); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <ul className="space-y-2">
                    {units.map(unit => (
                        <li key={unit.id} className={`flex items-center justify-between p-4 rounded-lg border ${unit.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                            <div className="flex items-center">
                                <span className={`w-2.5 h-2.5 rounded-full mr-3 ${unit.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className="font-medium text-gray-800">{unit.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => onToggleUnit(unit.id)} className={`p-1.5 rounded hover:bg-gray-100 ${unit.active ? 'text-green-600' : 'text-gray-400'}`}>
                                    <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => { setEditingUnitId(unit.id); setUnitName(unit.name); }} className="p-1.5 text-blue-600 rounded hover:bg-blue-50">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => onDeleteUnit(unit.id)} className="p-1.5 text-red-600 rounded hover:bg-red-50">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* --- DISTRIBUTION TAB --- */}
        {activeTab === 'distribution' && (
            <div className="max-w-3xl">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Distribuição de Equipe</h2>
                    <p className="text-gray-500">Vincule vendedores às unidades em que podem operar.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selecione a Unidade para Configurar</label>
                    <select 
                        onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-6"
                        defaultValue=""
                    >
                        <option value="" disabled>Escolha uma unidade...</option>
                        {units.filter(u => u.active).map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
                    </select>

                    {selectedUnitId !== null ? (
                        <div>
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Vendedores com Acesso</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
                                {sellers.filter(s => s.active).map(seller => (
                                    <label key={seller.id} className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-all ${linkedSellerIds.has(seller.id) ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                        <input 
                                            type="checkbox" 
                                            checked={linkedSellerIds.has(seller.id)}
                                            onChange={() => handleSellerLinkToggle(seller.id)}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                                            <p className="text-xs text-gray-500">{seller.role}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={() => {
                                        if (selectedUnitId !== null) {
                                            onUpdateLinks(selectedUnitId, Array.from(linkedSellerIds));
                                            alert('Vínculos salvos com sucesso!');
                                        }
                                    }} 
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 shadow-sm"
                                >
                                    Salvar Vínculos
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-md border border-dashed border-gray-300">
                            <LinkIcon className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                            Selecione uma unidade acima para começar.
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- GOALS TAB --- */}
        {activeTab === 'goals' && (
            <div className="max-w-2xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Metas e Objetivos</h2>
                    <p className="text-gray-500">Defina as metas financeiras para sua operação comercial.</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-start space-x-4">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <TargetIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">Meta Mensal Global</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Estabeleça o valor total de vendas esperado para o mês corrente. Este valor será usado para calcular o atingimento no Dashboard Estratégico.
                            </p>
                            
                            <div className="relative rounded-md shadow-sm max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">R$</span>
                                </div>
                                <input
                                    type="number"
                                    value={localGoal}
                                    onChange={(e) => setLocalGoal(Number(e.target.value))}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-lg border-gray-300 rounded-md py-3"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button 
                                    onClick={handleSaveGoal}
                                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                                >
                                    Salvar Meta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- AI INTEGRATION TAB --- */}
        {activeTab === 'ai-integration' && (
            <div className="max-w-2xl">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Integração Mentor AI</h2>
                    <p className="text-gray-500">Configure o modelo de inteligência artificial que potencializa o sistema.</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chave de API (Simulação)</label>
                        <input 
                            type="password" 
                            value={aiConfig.apiKey}
                            onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                            placeholder="sk-..."
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">A chave é armazenada com segurança.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Modelo de IA</label>
                        <select 
                            value={aiConfig.model}
                            onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="gpt-4">GPT-4 (Recomendado)</option>
                            <option value="gpt-3.5">GPT-3.5 Turbo</option>
                            <option value="claude-2">Claude 2</option>
                            <option value="gemini-pro">Gemini Pro</option>
                        </select>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tom de Voz</label>
                        <select 
                            value={aiConfig.tone}
                            onChange={(e) => setAiConfig({...aiConfig, tone: e.target.value})}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Profissional">Profissional e Objetivo</option>
                            <option value="Consultivo">Consultivo e Educador</option>
                            <option value="Persuasivo">Energético e Persuasivo</option>
                            <option value="Empatico">Empático e Acolhedor</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                            Salvar Configurações
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- AI TRAINER TAB --- */}
        {activeTab === 'ai-trainer' && (
            <div className="max-w-3xl">
                 <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Treinador do Mentor AI</h2>
                    <p className="text-gray-500">Ensine a IA sobre seus produtos, serviços e diferenciais competitivos.</p>
                </div>

                <div className="space-y-6">
                    {/* Context Text Area */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                <BrainIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Contexto do Negócio</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Descreva sua empresa, o que você vende, quem é seu público-alvo e quais são seus principais argumentos de venda.
                        </p>
                        <textarea 
                            rows={6}
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Ex: Somos uma consultoria de TI especializada em migração para nuvem. Nosso público são empresas de médio porte que buscam reduzir custos..."
                            value={aiTraining.businessContext}
                            onChange={(e) => setAiTraining({...aiTraining, businessContext: e.target.value})}
                        ></textarea>
                    </div>

                    {/* File Upload Simulation */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                         <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <UploadIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Base de Conhecimento</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Faça upload de PDFs, manuais de produtos ou scripts de vendas para a IA consultar.
                        </p>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Clique para fazer upload ou arraste arquivos</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT (Máx. 10MB)</p>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Arquivos Carregados (Demo)</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-700">Catalogo_Produtos_2023.pdf</span>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-xs font-medium">Remover</button>
                                </li>
                                <li className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-700">Script_Vendas_Objeções.docx</span>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-xs font-medium">Remover</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                     <div className="flex justify-end">
                        <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 shadow-sm">
                            Salvar Treinamento
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SettingsPage;
