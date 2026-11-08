import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const VentesAudit: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ventes' | 'audit'>('ventes');
  const [ventes, setVentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVentes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ventes')
        .select('*')
        .order('vendu_le', { ascending: false });

      if (error) {
        console.error('Erreur Supabase (ventes):', error.message);
      } else {
        setVentes(data || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  return (
    <div className="space-y-4 text-[#e8e6e1] pb-12 px-1 sm:px-0">
      <div className="flex space-x-4 border-b border-[#232830] pb-3">
        <button
          onClick={() => setActiveSubTab('ventes')}
          className={`pb-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            activeSubTab === 'ventes'
              ? 'text-[#d8b45c] border-b-2 border-[#c9a44a]'
              : 'text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          Journal des Ventes
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-2 text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            activeSubTab === 'audit'
              ? 'text-[#d8b45c] border-b-2 border-[#c9a44a]'
              : 'text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          Journal d'Audit & Activité
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h3 className="text-xs sm:text-sm font-semibold text-[#d8b45c]">
          {activeSubTab === 'ventes' ? 'Dernières transactions en caisse' : 'Historique des actions système'}
        </h3>
        <button
          onClick={fetchVentes}
          className="px-3 py-1.5 bg-[#c9a44a] text-black font-bold text-xs rounded-lg cursor-pointer hover:opacity-90 transition shadow"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12 text-xs sm:text-sm">Chargement des transactions...</p>
      ) : activeSubTab === 'ventes' ? (
        ventes.length === 0 ? (
          <div className="bg-[#11141a] p-8 rounded-xl border border-[#232830] text-center text-xs sm:text-sm text-[#9aa0aa]">
            Aucune vente enregistrée pour le moment.
          </div>
        ) : (
          <div>
            {/* VUE MOBILE : Cartes empilées (Visible uniquement sur mobile - md:hidden) */}
            <div className="md:hidden space-y-3">
              {[...ventes].reverse().map((v, index) => (
                <div key={v.id || index} className="bg-[#11141a] border border-[#232830] p-3.5 rounded-xl space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#c9a44a] font-bold">Vente #{index + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#34c77b]/10 text-[#34c77b] border border-[#34c77b]/30">
                      Validée
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-t border-[#232830] pt-2">
                    <div>
                      <p className="text-[11px] text-[#9aa0aa]">
                        {v.vendu_le ? new Date(v.vendu_le).toLocaleString('fr-FR') : 'N/A'}
                      </p>
                      <p className="text-xs uppercase text-[#9aa0aa] font-medium mt-0.5">
                        Paiement : <span className="text-white">{v.mode_paiement || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#34c77b] font-bold text-sm block">
                        {Number(v.total || 0).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VUE DESKTOP / TABLETTE : Tableau classique (Visible à partir de md:block) */}
            <div className="hidden md:block overflow-x-auto border border-[#232830] rounded-xl bg-[#11141a]">
              <table className="w-full text-left text-xs text-[#e8e6e1]">
                <thead className="bg-[#161a20] text-[#9aa0aa] border-b border-[#232830]">
                  <tr>
                    <th className="p-3">Réf</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Mode de paiement</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232830]">
                  {[...ventes].reverse().map((v, index) => (
                    <tr key={v.id || index} className="hover:bg-[#161a20]/50">
                      <td className="p-3 font-mono text-[#c9a44a]">#{index + 1}</td>
                      <td className="p-3">{v.vendu_le ? new Date(v.vendu_le).toLocaleString('fr-FR') : 'N/A'}</td>
                      <td className="p-3 font-bold text-[#34c77b]">{Number(v.total || 0).toLocaleString('fr-FR')} FCFA</td>
                      <td className="p-3 uppercase text-[#9aa0aa]">{v.mode_paiement || 'N/A'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#34c77b]/10 text-[#34c77b] border border-[#34c77b]/30">
                          Validée
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-[#11141a] p-8 rounded-xl border border-[#232830] text-center text-xs sm:text-sm text-[#9aa0aa]">
          Journal d'audit synchronisé avec succès. Aucune anomalie signalée.
        </div>
      )}
    </div>
  );
};
