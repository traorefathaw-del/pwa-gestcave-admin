import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Produit {
  id: string;
  nom: string;
  stock: number;
  prix_vente: number;
  prix_achat: number;
}

interface MouvementStock {
  id: string;
  produit_id: string;
  produit_nom: string;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  ancien_stock: number;
  nouveau_stock: number;
  motif?: string;
  cree_le: string;
}

export default function StockTab() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data: prodData } = await supabase.from('produits').select('*').is('deleted_at', null);
    const { data: mouvData } = await supabase.from('mouvements_stock').select('*').order('cree_le', { ascending: false }).limit(20);
    
    setProduits(prodData || []);
    setMouvements(mouvData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 text-[#e8e6e1]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Gestion du Stock</h3>
        <button 
          onClick={fetchData}
          className="px-3 py-1.5 bg-[#c9a44a] text-black font-bold text-xs rounded-lg cursor-pointer"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-8">Chargement du stock...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Liste des produits */}
          <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
            <h4 className="font-semibold text-sm mb-3 text-[#d8b45c]">État des Stocks ({produits.length})</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {produits.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-[#161a20] rounded-lg border border-[#232830]">
                  <div>
                    <p className="font-medium text-white text-sm">{p.nom}</p>
                    <p className="text-xs text-[#9aa0aa]">{p.prix_vente} FCFA</p>
                  </div>
                  <span className="px-2 py-1 bg-[#c9a44a]/10 text-[#c9a44a] rounded font-bold text-xs">
                    {p.stock} unités
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mouvements récents */}
          <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
            <h4 className="font-semibold text-sm mb-3 text-[#d8b45c]">Derniers Mouvements</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mouvements.length === 0 ? (
                <p className="text-xs text-[#9aa0aa] text-center py-4">Aucun mouvement récent.</p>
              ) : (
                mouvements.map((m) => (
                  <div key={m.id} className="p-3 bg-[#161a20] rounded-lg border border-[#232830] text-xs">
                    <div className="flex justify-between font-medium text-white mb-1">
                      <span>{m.produit_nom}</span>
                      <span className={m.type === 'entree' ? 'text-[#34c77b]' : 'text-[#e5484d]'}>
                        {m.type === 'entree' ? `+${m.quantite}` : m.quantite}
                      </span>
                    </div>
                    <p className="text-[#9aa0aa]">Stock : {m.ancien_stock} → {m.nouveau_stock}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
