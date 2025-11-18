
import React, { useState, useMemo } from 'react';
import { Sale, Filters, Unit, Seller, UserRole } from './types';
import Dashboard from './components/Dashboard';
import FilterSection from './components/FilterSection';
import SalesTable from './components/SalesTable';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import SettingsPage from './components/SettingsPage';
import StrategicDashboard from './components/StrategicDashboard';
import PerformanceDashboard from './components/PerformanceDashboard';
import { MentorAIIcon } from './components/icons';
import { MOCK_SALES_DATA } from './mockData';

const App: React.FC = () => {
  const [salesData, setSalesData] = useState<Sale[]>(MOCK_SALES_DATA);
  const [activeView, setActiveView] = useState<'sales' | 'strategy' | 'kanban' | 'ai' | 'settings' | 'performance'>('sales');
  const [monthlyGoal, setMonthlyGoal] = useState<number>(50000);
  
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, name: 'São Paulo', active: true },
    { id: 2, name: 'Rio de Janeiro', active: true },
    { id: 3, name: 'Belo Horizonte', active: true },
    { id: 4, name: 'Porto Alegre', active: true },
    { id: 5, name: 'Curitiba', active: true },
  ]);

  const [sellers, setSellers] = useState<Seller[]>([
    { id: 1, name: 'Ana Silva', active: true, role: 'Gestor', email: 'ana.silva@empresa.com.br', phone: '(11) 99999-0001' },
    { id: 2, name: 'Bruno Costa', active: true, role: 'Equipe', email: 'bruno.costa@empresa.com.br', phone: '(21) 99999-0002' },
    { id: 3, name: 'Cláudia Martins', active: true, role: 'Equipe', email: 'claudia.martins@empresa.com.br', phone: '(31) 99999-0003' },
    { id: 4, name: 'Daniel Almeida', active: true, role: 'Equipe', email: 'daniel.almeida@empresa.com.br', phone: '(51) 99999-0004' },
    { id: 5, name: 'Eduardo Lima', active: true, role: 'Master', email: 'eduardo.lima@empresa.com.br', phone: '(41) 99999-0005' },
  ]);

  const [unitSellerLinks, setUnitSellerLinks] = useState<{ [key: number]: number[] }>({
    1: [1, 3],
    2: [2],
    3: [3],
    4: [4],
    5: [5],
  });


  const [filters, setFilters] = useState<Filters>({
    unidade: '',
    vendedor: '',
    dataCadastro: '',
    valorInicial: '',
    valorVenda: '',
    nomeCliente: '',
    telefone: '',
    categoria: '',
    origem: '',
    status: '',
    etapaFunil: '',
  });

  const filteredData = useMemo(() => {
    return salesData.filter(sale => {
      return (
        (filters.unidade ? sale.unidade === filters.unidade : true) &&
        (filters.vendedor ? sale.vendedor === filters.vendedor : true) &&
        (filters.dataCadastro ? sale.dataCadastro.startsWith(filters.dataCadastro) : true) &&
        (filters.nomeCliente ? sale.nomeCliente.toLowerCase().includes(filters.nomeCliente.toLowerCase()) : true) &&
        (filters.categoria ? sale.categoria === filters.categoria : true) &&
        (filters.origem ? sale.origem === filters.origem : true) &&
        (filters.status ? sale.status === filters.status : true) &&
        (filters.etapaFunil ? sale.etapaFunil === filters.etapaFunil : true)
      );
    });
  }, [salesData, filters]);

  const handleFilterChange = (filterName: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      unidade: '',
      vendedor: '',
      dataCadastro: '',
      valorInicial: '',
      valorVenda: '',
      nomeCliente: '',
      telefone: '',
      categoria: '',
      origem: '',
      status: '',
      etapaFunil: '',
    });
  };

  // --- Unit Management ---
  const addUnit = (name: string) => {
    if (name && !units.find(u => u.name.toLowerCase() === name.toLowerCase())) {
        setUnits(prev => [...prev, { id: Date.now(), name, active: true }]);
    }
  };

  const updateUnit = (id: number, name: string) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, name } : u));
  };

  const toggleUnitStatus = (id: number) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUnit = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta unidade?')) {
        setUnits(prev => prev.filter(u => u.id !== id));
        // Also remove links
        setUnitSellerLinks(prev => {
            const newLinks = { ...prev };
            delete newLinks[id];
            return newLinks;
        });
    }
  };

  // --- Seller Management ---
  const addSeller = (name: string, email: string, phone: string, role: UserRole) => {
    if (name && !sellers.find(s => s.name.toLowerCase() === name.toLowerCase())) {
        setSellers(prev => [...prev, { 
            id: Date.now(), 
            name, 
            email,
            phone,
            role,
            active: true 
        }]);
    }
  };

  const updateSeller = (id: number, name: string, email: string, phone: string, role: UserRole) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, name, email, phone, role } : s));
  };

  const toggleSellerStatus = (id: number) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const deleteSeller = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
        setSellers(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateUnitSellerLinks = (unitId: number, sellerIds: number[]) => {
    setUnitSellerLinks(prev => ({
        ...prev,
        [unitId]: sellerIds,
    }));
  };

  const addSale = (newSaleData: Omit<Sale, 'id' | 'dataCadastro' | 'etapaFunil' | 'status'>) => {
    const newSale: Sale = {
        ...newSaleData,
        id: Date.now(),
        dataCadastro: new Date().toISOString().split('T')[0], 
        etapaFunil: 'Lead',
        status: 'Ativo',
    };
    setSalesData(prev => [newSale, ...prev]);
  };

  const updateSale = (updatedSale: Sale) => {
    setSalesData(prev => prev.map(sale => sale.id === updatedSale.id ? updatedSale : sale));
  };

  const viewTitles = {
    sales: 'Painel de Vendas',
    strategy: 'Dashboard Estratégico',
    performance: 'Performance de Vendas',
    kanban: 'Kanban',
    ai: 'Mentor AI',
    settings: 'Configurações',
  };

  const renderContent = () => {
    switch (activeView) {
      case 'sales':
        return (
          <div className="space-y-8">
            <Dashboard data={filteredData} units={units.filter(u => u.active)} sellers={sellers.filter(s => s.active)} />
            <FilterSection filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} units={units.filter(u => u.active)} sellers={sellers.filter(s => s.active)} />
            <SalesTable data={filteredData} />
          </div>
        );
      case 'strategy':
        return (
           <StrategicDashboard data={salesData} monthlyGoal={monthlyGoal} />
        );
      case 'performance':
        return (
            <PerformanceDashboard data={salesData} sellers={sellers.filter(s => s.active)} />
        );
      case 'kanban':
        return <KanbanBoard 
          data={filteredData} 
          onAddSale={addSale}
          onUpdateSale={updateSale}
          units={units.filter(u => u.active)}
          sellers={sellers.filter(s => s.active)}
          unitSellerLinks={unitSellerLinks}
          allSales={salesData}
        />;
      case 'ai':
        return (
           <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="bg-indigo-100 p-6 rounded-full mb-6">
                <MentorAIIcon className="h-16 w-16 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Mentor AI</h2>
            <p className="mt-4 text-gray-500 max-w-md text-lg">
                Seu assistente inteligente está sendo configurado. Acesse <span className="font-bold text-indigo-600 cursor-pointer" onClick={() => setActiveView('settings')}>Configurações</span> para integrar e treinar sua IA.
            </p>
          </div>
        );
      case 'settings':
        return (
            <SettingsPage 
                units={units}
                sellers={sellers}
                unitSellerLinks={unitSellerLinks}
                onAddUnit={addUnit}
                onUpdateUnit={updateUnit}
                onToggleUnit={toggleUnitStatus}
                onDeleteUnit={deleteUnit}
                onAddSeller={addSeller}
                onUpdateSeller={updateSeller}
                onToggleSeller={toggleSellerStatus}
                onDeleteSeller={deleteSeller}
                onUpdateLinks={updateUnitSellerLinks}
                monthlyGoal={monthlyGoal}
                onUpdateMonthlyGoal={setMonthlyGoal}
            />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md z-10">
          <div className="container mx-auto py-6 px-6">
            <h1 className="text-3xl font-bold text-gray-900">{viewTitles[activeView]}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="container mx-auto h-full">
            {renderContent()}
          </div>
           <footer className="mt-8 py-4">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              <p>&copy; {new Date().getFullYear()} Sistema de Vendas. Todos os direitos reservados.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
