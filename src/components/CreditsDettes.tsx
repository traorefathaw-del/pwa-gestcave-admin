import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DetteItem {
  id: string;
  client_id?: string;
  vente_id?: string;
  montant: number;
  montant_paye?: number;
  statut?: string;
  updated_at?: string;
}

const formatFCFA = (valeur: number) => {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} FCFA`;
};

export const CreditsDettes: React.FC = () => {
  const [items, setItems] = useState<DetteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDettes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dettes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase (dettes):', error.message);
        setItems([]);
      } else {
        setItems(data || []);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDettes();
  }, []);

  return (
    <div className="space-y-6 text-[#e8e6e1] pb-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#232830] pb-4 gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#d8b45c]">Module : Crédits Clients</h3>
          <p className="text-[11px] text-[#9aa0aa] mt-0.5">Suivi des arriérés et créances clients en cours</p>
        </div>
        <button
          onClick={fetchDettes}
          className="px-3 py-1.5 bg-[#c9a44a] text-black text-xs font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12">Connexion à la base de données...</p>
      ) : items.length === 0 ? (
        <div className="bg-[#11141a] p-8 rounded-xl border border-[#232830] text-center space-y-2">
          <p className="text-white font-medium text-sm">Aucun dossier de crédit enregistré.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => {
            const isSolde = item.statut && item.statut.toLowerCase() === 'soldee';
            return (
              <div key={item.id || index} className="bg-[#11141a] p-4 rounded-xl border border-[#232830] flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#232830] text-[#c9a44a] font-semibold">
                    Client ID : {item.client_id ? `${item.client_id.substring(0, 8)}...` : 'N/A'}
                  </span>
                  <h4 className="font-bold text-white text-base mt-1">Vente : #{item.vente_id ? item.vente_id.substring(0, 8) : 'N/A'}</h4>
                  <p className="text-xs text-[#9aa0aa]">
                    Mise à jour : {item.updated_at ? new Date(item.updated_at).toLocaleString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[#34c77b] font-bold text-base block">{formatFCFA(item.montant)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border capitalize inline-block mt-1 ${
                    isSolde 
                      ? 'bg-[#34c77b]/10 text-[#34c77b] border-[#34c77b]/30' 
                      : 'bg-[#e05656]/10 text-[#e05656] border-[#e05656]/30'
                  }`}>
                    {item.statut || 'En cours'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
