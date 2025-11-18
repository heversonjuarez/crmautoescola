
import React from 'react';
import { DashboardIcon, KanbanIcon, MentorAIIcon, SettingsIcon, PresentationChartIcon, TrendingUpIcon } from './icons';

interface SidebarProps {
  activeView: 'sales' | 'strategy' | 'kanban' | 'ai' | 'settings' | 'performance';
  setActiveView: (view: 'sales' | 'strategy' | 'kanban' | 'ai' | 'settings' | 'performance') => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white h-full shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-400">VendasPRO</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          <NavItem
            icon={<DashboardIcon />}
            label="Painel de Vendas"
            isActive={activeView === 'sales'}
            onClick={() => setActiveView('sales')}
          />
          <NavItem
            icon={<PresentationChartIcon />}
            label="Estratégico"
            isActive={activeView === 'strategy'}
            onClick={() => setActiveView('strategy')}
          />
          <NavItem
            icon={<TrendingUpIcon />}
            label="Performance"
            isActive={activeView === 'performance'}
            onClick={() => setActiveView('performance')}
          />
          <NavItem
            icon={<KanbanIcon />}
            label="Kanban"
            isActive={activeView === 'kanban'}
            onClick={() => setActiveView('kanban')}
          />
          <NavItem
            icon={<MentorAIIcon />}
            label="Mentor AI"
            isActive={activeView === 'ai'}
            onClick={() => setActiveView('ai')}
          />
        </ul>
         <div className="mt-4 pt-4 border-t border-gray-700">
            <NavItem
                icon={<SettingsIcon />}
                label="Configurações"
                isActive={activeView === 'settings'}
                onClick={() => setActiveView('settings')}
            />
        </div>
      </nav>
      <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
        <span>Versão 1.0.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
