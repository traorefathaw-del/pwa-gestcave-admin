import { useState } from 'react';
import { 
  CheckSquare, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Layers, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Approbations as ApprobationsTab } from './components/Approbations';
import StockTab from './components/Stock';
import { Produits } from './components/Produits';
import { VentesAudit } from './components/VentesAudit';
import { CreditsDettes } from './components/CreditsDettes';
import { Rapports } from './components/Rapports';

export default function App() {
  const [activeTab, setActiveTab] = useState<'approbations' | 'stock' | 'ventes' | 'credits' | 'produits' | 'rapports'>('ventes');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Vérifie si l'onglet actif fait partie du menu "Plus" mobile
  const isMoreActive = ['approbations', 'rapports'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#e8e6e1] flex flex-col font-sans pb-20 md:pb-6">
      {/* En-tête de l'application */}
      <header className="bg-[#11141a] border-b border-[#232830] px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-[#c9a44a]/12 text-[#c9a44a] p-2 rounded-lg border border-[#c9a44a]/30 font-bold text-lg">
            GC
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-[#d8b45c] m-0">Administration GestCave</h1>
            <p className="text-[11px] sm:text-xs text-[#9aa0aa]"></p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#34c77b]"></span>
          <span className="text-xs text-[#9aa0aa] hidden sm:inline">Connecté au Cloud</span>
        </div>
      </header>

      {/* Navigation par onglets (Desktop / Tablettes - Cachée sur mobile) */}
      <nav className="hidden md:flex bg-[#11141a] border-b border-[#232830] px-6 space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('ventes')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'ventes'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <ShoppingCart size={18} />
          <span>Ventes & Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('produits')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'produits'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <Layers size={18} />
          <span>Produits</span>
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'stock'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <Package size={18} />
          <span>Stock & Mouvements</span>
        </button>
        <button
          onClick={() => setActiveTab('credits')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'credits'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <CreditCard size={18} />
          <span>Crédits / Dettes</span>
        </button>
        <button
          onClick={() => setActiveTab('approbations')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'approbations'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <CheckSquare size={18} />
          <span>Approbations</span>
        </button>
        <button
          onClick={() => setActiveTab('rapports')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'rapports'
              ? 'border-[#c9a44a] text-[#d8b45c] bg-[#c9a44a]/5'
              : 'border-transparent text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          <BarChart3 size={18} />
          <span>Rapports</span>
        </button>
      </nav>

      {/* Contenu principal (Affichage direct du composant actif sans encadré superflu) */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'approbations' && <ApprobationsTab />}
        {activeTab === 'stock' && <StockTab />}
        {activeTab === 'produits' && <Produits />}
        {activeTab === 'ventes' && <VentesAudit />}
        {activeTab === 'credits' && <CreditsDettes />}
        {activeTab === 'rapports' && <Rapports />}
      </main>

      {/* MODAL DU MENU "PLUS (...)" SUR MOBILE */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4 md:hidden">
          <div className="bg-[#11141a] border border-[#232830] w-full max-w-sm rounded-2xl p-4 space-y-2 text-[#e8e6e1] shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center border-b border-[#232830] pb-2 mb-2">
              <h4 className="text-xs font-semibold text-[#c9a44a]">Plus de modules</h4>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="text-[#9aa0aa] hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <button
              onClick={() => { setActiveTab('approbations'); setShowMoreMenu(false); }}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeTab === 'approbations' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#181c24] text-[#e8e6e1] hover:bg-[#232830]'
              }`}
            >
              <CheckSquare size={16} />
              <span>Approbations</span>
            </button>

            <button
              onClick={() => { setActiveTab('rapports'); setShowMoreMenu(false); }}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 ${
                activeTab === 'rapports' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#181c24] text-[#e8e6e1] hover:bg-[#232830]'
              }`}
            >
              <BarChart3 size={16} />
              <span>Rapports d'activité</span>
            </button>
          </div>
        </div>
      )}

      {/* BARRE DE NAVIGATION INFÉRIEURE MOBILE */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#11141a] border-t border-[#232830] z-40 px-2 py-1.5 flex justify-around items-center shadow-2xl">
        <button
          onClick={() => setActiveTab('ventes')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'ventes' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <ShoppingCart size={20} className="mb-0.5" />
          <span>Ventes</span>
        </button>

        <button
          onClick={() => setActiveTab('produits')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'produits' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <Layers size={20} className="mb-0.5" />
          <span>Produits</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'stock' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <Package size={20} className="mb-0.5" />
          <span>Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('credits')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'credits' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <CreditCard size={20} className="mb-0.5" />
          <span>Crédits</span>
        </button>

        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            isMoreActive ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <Menu size={20} className="mb-0.5" />
          <span>Plus</span>
        </button>
      </nav>
    </div>
  );
}
