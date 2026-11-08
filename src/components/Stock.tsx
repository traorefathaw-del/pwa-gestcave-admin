import { useEffect, useState } from 'react';
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
    <div className="space-y-4 text-[#e8e6e1] pb-12 px-1 sm:px-0">
      <div className="flex justify-between items-center border-b border-[#232830] pb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#d8b45c]">Gestion du Stock</h3>
          <p className="text-[11px] text-[#9aa0aa] mt-0.5">Suivi des stocks en direct et mouvements récents</p>
        </div>
        <button 
          onClick={fetchData}
          className="px-3 py-1.5 bg-[#c9a44a] text-black font-bold text-xs rounded-lg hover:opacity-90 transition cursor-pointer shadow"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12 text-xs sm:text-sm">Chargement du stock...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Liste des produits */}
          <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
            <h4 className="font-semibold text-xs sm:text-sm mb-3 text-[#d8b45c]">État des Stocks ({produits.length})</h4>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {produits.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-[#161a20] rounded-xl border border-[#232830] gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-xs sm:text-sm truncate">{p.nom}</p>
                    <p className="text-[11px] text-[#9aa0aa] mt-0.5">{Number(p.prix_vente || 0).toLocaleString('fr-FR')} FCFA</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#c9a44a]/10 text-[#c9a44a] rounded-lg font-bold text-xs whitespace-nowrap border border-[#c9a44a]/20">
                    {p.stock} unités
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mouvements récents */}
          <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
            <h4 className="font-semibold text-xs sm:text-sm mb-3 text-[#d8b45c]">Derniers Mouvements</h4>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {mouvements.length === 0 ? (
                <p className="text-xs text-[#9aa0aa] text-center py-8">Aucun mouvement récent.</p>
              ) : (
                mouvements.map((m) => (
                  <div key={m.id} className="p-3 bg-[#161a20] rounded-xl border border-[#232830] text-xs space-y-1">
                    <div className="flex justify-between font-medium text-white items-center">
                      <span className="truncate pr-2">{m.produit_nom}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                        m.type === 'entree' 
                          ? 'bg-[#34c77b]/10 text-[#34c77b] border border-[#34c77b]/30' 
                          : 'bg-[#e05656]/10 text-[#e05656] border border-[#e05656]/30'
                      }`}>
                        {m.type === 'entree' ? `+${m.quantite}` : m.quantite}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9aa0aa]">Stock : <span className="text-white">{m.ancien_stock}</span> → <span className="text-[#c9a44a] font-bold">{m.nouveau_stock}</span></p>
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
