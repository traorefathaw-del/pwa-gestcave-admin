import React, { useState } from 'react';
import { 
  CheckSquare, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Layers, 
  BarChart3, 
  RefreshCw 
} from 'lucide-react';
import { Approbations as ApprobationsTab } from './components/Approbations';
import StockTab from './components/Stock';
import { Produits } from './components/Produits';
import { VentesAudit } from './components/VentesAudit';
import { CreditsDettes } from './components/CreditsDettes';
import { Rapports } from './components/Rapports';

export default function App() {
  const [activeTab, setActiveTab] = useState<'approbations' | 'stock' | 'ventes' | 'credits' | 'produits' | 'rapports'>('approbations');

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#e8e6e1] flex flex-col font-sans">
      {/* En-tête */}
      <header className="bg-[#11141a] border-b border-[#232830] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-[#c9a44a]/12 text-[#c9a44a] p-2 rounded-lg border border-[#c9a44a]/30 font-bold text-lg">
            GC
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-[#d8b45c] m-0">GestCave Admin</h1>
            <p className="text-xs text-[#9aa0aa]">Console Patron • Supabase Cloud</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#34c77b]"></span>
          <span className="text-xs text-[#9aa0aa]">Connecté au Cloud</span>
        </div>
      </header>

      {/* Navigation par onglets */}
      <nav className="bg-[#11141a] border-b border-[#232830] px-6 flex space-x-2 overflow-x-auto">
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

      {/* Contenu principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="bg-[#161a20] border border-[#232830] rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#232830]">
            <h2 className="text-lg font-semibold text-[#e8e6e1] capitalize m-0">
              Module : {activeTab.replace('_', ' & ')}
            </h2>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-[#232830] hover:bg-[#232830]/80 text-[#e8e6e1] text-xs rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Actualiser</span>
            </button>
          </div>

          {/* Rendu dynamique de tous les modules */}
          {activeTab === 'approbations' && <ApprobationsTab />}
          {activeTab === 'stock' && <StockTab />}
          {activeTab === 'produits' && <Produits />}
          {activeTab === 'ventes' && <VentesAudit />}
          {activeTab === 'credits' && <CreditsDettes />}
          {activeTab === 'rapports' && <Rapports />}
        </div>
      </main>
    </div>
  );
}
