import React, { useEffect, useState } from 'react';
import { supabase, now } from '../lib/supabase';
import { Produit, MouvementStock } from '../types';

export const StockMouvements: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [tab, setTab] = useState<'stock' | 'historique'>('stock');

  const loadData = async () => {
    const { data: p } = await supabase.from('produits').select('*').is('deleted_at', null).order('nom');
    const { data: m } = await supabase.from('mouvements_stock').select('*').is('deleted_at', null).order('cree_le', { ascending: false }).limit(30);
    setProduits(p || []);
    setMouvements(m || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Édition directe patron avec écriture simultanée du mouvement d'audit
  const ajusterStockDirect = async (produitId: string, ancienStock: number) => {
    const saisie = prompt('Nouveau stock total :');
    if (!saisie) return;
    const nouveauStock = parseInt(saisie, 10);
    if (isNaN(nouveauStock)) return;

    const diff = nouveauStock - ancienStock;

    // 1. Update Produit
    await supabase.from('produits').update({ stock: nouveauStock, updated_at: now() }).eq('id', produitId);

    // 2. Insert Mouvement Audit
    await supabase.from('mouvements_stock').insert({
      id: crypto.randomUUID(),
      produit_id: produitId,
      type: 'ajustement',
      quantite: diff,
      note: 'Ajustement direct PWA patron',
      cree_le: now(),
      updated_at: now(),
    });

    loadData();
  };

  return (
    <div className="p-4 pb-24 text-[#e8e6e1]">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('stock')} className={`flex-1 py-2 rounded-lg font-semibold text-sm ${tab === 'stock' ? 'bg-[#c9a44a] text-[#0b0d10]' : 'bg-[#161a20]'}`}>
          État du Stock
        </button>
        <button onClick={() => setTab('historique')} className={`flex-1 py-2 rounded-lg font-semibold text-sm ${tab === 'historique' ? 'bg-[#c9a44a] text-[#0b0d10]' : 'bg-[#161a20]'}`}>
          Mouvements Audit
        </button>
      </div>

      {tab === 'stock' ? (
        <div className="space-y-2">
          {produits.map((p) => {
            const isAlerte = p.stock <= p.seuil_alerte;
            return (
              <div key={p.id} className="bg-[#161a20] border border-[#232830] p-3 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{p.nom}</h4>
                  <p className="text-xs text-[#9aa0aa]">Seuil : {p.seuil_alerte} u.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${isAlerte ? 'text-[#e5484d]' : 'text-[#34c77b]'}`}>
                    {p.stock} u.
                  </span>
                  <button onClick={() => ajusterStockDirect(p.id, p.stock)} className="bg-[#232830] px-2 py-1 rounded text-xs text-[#c9a44a]">
                    Éditer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {mouvements.map((m) => (
            <div key={m.id} className="bg-[#161a20] p-3 rounded-xl border border-[#232830] flex justify-between">
              <div>
                <p className="text-sm font-semibold">{m.note || m.type}</p>
                <p className="text-xs text-[#9aa0aa]">{new Date(m.cree_le).toLocaleString('fr-FR')}</p>
              </div>
              <span className={`font-bold text-sm ${m.quantite >= 0 ? 'text-[#34c77b]' : 'text-[#e5484d]'}`}>
                {m.quantite > 0 ? `+${m.quantite}` : m.quantite}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
