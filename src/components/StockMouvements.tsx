import React, { useEffect, useState } from 'react';
import { supabase, now } from '../lib/supabase';
import type { Produit, MouvementStock } from '../types';

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
    <div className="space-y-4 text-[#e8e6e1] pb-12 px-1 sm:px-0">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('stock')}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition ${
            tab === 'stock' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#11141a] border border-[#232830] text-[#9aa0aa] hover:text-white'
          }`}
        >
          État du Stock
        </button>
        <button
          onClick={() => setTab('historique')}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition ${
            tab === 'historique' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#11141a] border border-[#232830] text-[#9aa0aa] hover:text-white'
          }`}
        >
          Mouvements Audit
        </button>
      </div>

      {tab === 'stock' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {produits.map((p) => {
            const isAlerte = p.stock <= p.seuil_alerte;
            return (
              <div key={p.id} className="bg-[#11141a] border border-[#232830] p-4 rounded-xl flex justify-between items-center shadow-md">
                <div className="min-w-0 flex-1 pr-2">
                  <h4 className="font-bold text-white text-sm sm:text-base truncate">{p.nom}</h4>
                  <p className="text-[11px] sm:text-xs text-[#9aa0aa] mt-0.5">Seuil d'alerte : {p.seuil_alerte} u.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs sm:text-sm font-bold px-2 py-1 rounded border ${
                    isAlerte 
                      ? 'bg-[#e05656]/10 text-[#e05656] border-[#e05656]/30' 
                      : 'bg-[#34c77b]/10 text-[#34c77b] border-[#34c77b]/30'
                  }`}>
                    {p.stock} u.
                  </span>
                  <button
                    onClick={() => ajusterStockDirect(p.id, p.stock)}
                    className="bg-[#232830] hover:bg-[#2c323d] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#c9a44a] cursor-pointer transition shadow"
                  >
                    Éditer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mouvements.length === 0 ? (
            <div className="col-span-full bg-[#11141a] p-8 rounded-xl border border-[#232830] text-center text-xs sm:text-sm text-[#9aa0aa]">
              Aucun mouvement récent.
            </div>
          ) : (
            mouvements.map((m) => (
              <div key={m.id} className="bg-[#11141a] p-4 rounded-xl border border-[#232830] flex justify-between items-center shadow-md">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">{m.note || m.type}</p>
                  <p className="text-[11px] text-[#9aa0aa] mt-0.5">{new Date(m.cree_le).toLocaleString('fr-FR')}</p>
                </div>
                <span className={`font-bold text-xs sm:text-sm px-2.5 py-1 rounded border shrink-0 ${
                  m.quantite >= 0 
                    ? 'bg-[#34c77b]/10 text-[#34c77b] border-[#34c77b]/30' 
                    : 'bg-[#e05656]/10 text-[#e05656] border-[#e05656]/30'
                }`}>
                  {m.quantite > 0 ? `+${m.quantite}` : m.quantite}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
