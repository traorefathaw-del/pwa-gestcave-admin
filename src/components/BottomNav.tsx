import React, { useState } from 'react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = ['approbations', 'rapports'].includes(currentTab);

  return (
    <>
      {/* Modal / Tiroir du menu "Plus" pour les onglets secondaires */}
      {showMoreMenu && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#11141a] border border-[#232830] w-full max-w-sm rounded-2xl p-4 space-y-2 text-[#e8e6e1] shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center border-b border-[#232830] pb-2 mb-2">
              <h4 className="text-xs font-semibold text-[#c9a44a]">Plus de modules</h4>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="text-[#9aa0aa] hover:text-white text-sm font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <button
              onClick={() => { setCurrentTab('approbations'); setShowMoreMenu(false); }}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 ${
                currentTab === 'approbations' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#181c24] text-[#e8e6e1] hover:bg-[#232830]'
              }`}
            >
              <span>📋 Approbations</span>
            </button>

            <button
              onClick={() => { setCurrentTab('rapports'); setShowMoreMenu(false); }}
              className={`w-full text-left px-3 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 ${
                currentTab === 'rapports' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#181c24] text-[#e8e6e1] hover:bg-[#232830]'
              }`}
            >
              <span>📈 Rapports d'activité</span>
            </button>
          </div>
        </div>
      )}

      {/* Barre de navigation inférieure mobile (Fixée en bas, visible uniquement sur petits écrans grâce à md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#11141a] border-t border-[#232830] z-40 px-1 py-1.5 flex justify-around items-center shadow-lg">
        <button
          onClick={() => setCurrentTab('ventes')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            currentTab === 'ventes' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <span className="text-base mb-0.5">🛒</span>
          <span>Ventes</span>
        </button>

        <button
          onClick={() => setCurrentTab('produits')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            currentTab === 'produits' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <span className="text-base mb-0.5">📦</span>
          <span>Produits</span>
        </button>

        <button
          onClick={() => setCurrentTab('stocks')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            currentTab === 'stocks' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <span className="text-base mb-0.5">📊</span>
          <span>Stocks</span>
        </button>

        <button
          onClick={() => setCurrentTab('credits')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            currentTab === 'credits' ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <span className="text-base mb-0.5">💳</span>
          <span>Crédits</span>
        </button>

        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition cursor-pointer ${
            isMoreActive ? 'text-[#c9a44a]' : 'text-[#9aa0aa] hover:text-white'
          }`}
        >
          <span className="text-base mb-0.5">☰</span>
          <span>Plus</span>
        </button>
      </nav>
    </>
  );
};
