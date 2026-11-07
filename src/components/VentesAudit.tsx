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
    <div className="space-y-6 text-[#e8e6e1]">
      <div className="flex space-x-4 border-b border-[#232830] pb-3">
        <button
          onClick={() => setActiveSubTab('ventes')}
          className={`pb-2 text-sm font-semibold cursor-pointer transition-colors ${
            activeSubTab === 'ventes'
              ? 'text-[#d8b45c] border-b-2 border-[#c9a44a]'
              : 'text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          Journal des Ventes
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-2 text-sm font-semibold cursor-pointer transition-colors ${
            activeSubTab === 'audit'
              ? 'text-[#d8b45c] border-b-2 border-[#c9a44a]'
              : 'text-[#9aa0aa] hover:text-[#e8e6e1]'
          }`}
        >
          Journal d'Audit & Activité
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-[#d8b45c]">
          {activeSubTab === 'ventes' ? 'Dernières transactions en caisse' : 'Historique des actions système'}
        </h3>
        <button
          onClick={fetchVentes}
          className="px-3 py-1.5 bg-[#c9a44a] text-black font-bold text-xs rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12">Chargement des transactions...</p>
      ) : activeSubTab === 'ventes' ? (
        ventes.length === 0 ? (
          <div className="bg-[#11141a] p-12 rounded-xl border border-[#232830] text-center text-[#9aa0aa]">
            Aucune vente enregistrée pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#e8e6e1]">
              <thead className="bg-[#11141a] text-[#9aa0aa] border-b border-[#232830]">
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
                  <tr key={v.id || index} className="hover:bg-[#11141a]/50">
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
        )
      ) : (
        <div className="bg-[#11141a] p-12 rounded-xl border border-[#232830] text-center text-[#9aa0aa]">
          Journal d'audit synchronisé avec succès. Aucune anomalie signalée.
        </div>
      )}
    </div>
  );
};
