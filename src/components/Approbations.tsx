import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Approbation {
  id: string;
  type: 'entree_stock' | 'modif_stock' | 'modif_prix';
  produit_id: string;
  produit_nom: string;
  valeur: number;
  ancien: number;
  statut: 'en_attente' | 'approuve' | 'rejete';
  applique: boolean;
  demande_par: string;
  decide_le: string | null;
  cree_le: string;
  deleted_at: string | null;
  note?: string;
  updated_at?: string;
}

const formatFCFA = (valeur: number) => {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} FCFA`;
};

const nowISO = () => new Date().toISOString();

export const Approbations: React.FC = () => {
  const [demandes, setDemandes] = useState<Approbation[]>([]);
  const [loading, setLoading] = useState(true);
  const [vue, setVue] = useState<'attente' | 'historique'>('attente');

  const fetchApprobations = async () => {
    setLoading(true);
    let query = supabase.from('approbations').select('*').is('deleted_at', null);

    if (vue === 'attente') {
      query = query.eq('statut', 'en_attente').order('cree_le', { ascending: false });
    } else {
      query = query.neq('statut', 'en_attente').order('decide_le', { ascending: false }).limit(30);
    }

    const { data } = await query;
    setDemandes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApprobations();
  }, [vue]);

  const traiterDemande = async (id: string, statut: 'approuve' | 'rejete', noteRejet?: string) => {
    const updatePayload: Partial<Approbation> = {
      statut,
      decide_le: nowISO(),
      updated_at: nowISO() as any,
    };

    if (noteRejet) {
      updatePayload.note = `Rejet patron : ${noteRejet}`;
    }

    await supabase.from('approbations').update(updatePayload).eq('id', id);
    fetchApprobations();
  };

  return (
    <div className="space-y-4 text-[#e8e6e1] pb-12 px-1 sm:px-0">
      {/* Boutons de bascule (Onglets internes) */}
      <div className="flex gap-2">
        <button
          onClick={() => setVue('attente')}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition ${
            vue === 'attente' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#11141a] border border-[#232830] text-[#9aa0aa] hover:text-white'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setVue('historique')}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm cursor-pointer transition ${
            vue === 'historique' ? 'bg-[#c9a44a] text-black font-bold' : 'bg-[#11141a] border border-[#232830] text-[#9aa0aa] hover:text-white'
          }`}
        >
          Historique
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12 text-xs sm:text-sm">Chargement des demandes...</p>
      ) : demandes.length === 0 ? (
        <div className="bg-[#11141a] p-8 rounded-xl border border-[#232830] text-center text-xs sm:text-sm text-[#9aa0aa]">
          Aucune demande trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {demandes.map((item) => (
            <div key={item.id} className="bg-[#11141a] border border-[#232830] p-4 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">{item.produit_nom}</h3>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#232830] text-[#c9a44a] font-semibold whitespace-nowrap">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-[#9aa0aa] mb-2">
                  Demandé par : <span className="text-white font-medium">{item.demande_par}</span>
                </p>

                <div className="bg-[#181c24] p-3 rounded-lg mb-3 border border-[#232830] text-xs sm:text-sm">
                  {item.type === 'entree_stock' && <p>Ajout stock : <span className="text-[#34c77b] font-bold">+{item.valeur} unités</span></p>}
                  {item.type === 'modif_stock' && <p>Ajustement : <span className="text-white">{item.ancien}</span> → <span className="text-[#c9a44a] font-bold">{item.valeur} unités</span></p>}
                  {item.type === 'modif_prix' && (
                    <p>Nouveau prix : {formatFCFA(item.ancien)} → <span className="text-[#34c77b] font-bold">{formatFCFA(item.valeur)}</span></p>
                  )}
                  {item.note && <p className="text-[11px] text-[#9aa0aa] mt-1.5 italic">Motif : "{item.note}"</p>}
                </div>
              </div>

              <div>
                {vue === 'attente' ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => traiterDemande(item.id, 'approuve')}
                      className="flex-1 bg-[#34c77b] text-black font-bold py-2 rounded-lg text-xs sm:text-sm cursor-pointer hover:opacity-90 transition shadow"
                    >
                      Approuvé
                    </button>
                    <button
                      onClick={() => {
                        const motif = prompt('Motif du rejet (optionnel) :');
                        traiterDemande(item.id, 'rejete', motif || undefined);
                      }}
                      className="flex-1 bg-[#e05656]/15 border border-[#e05656]/30 text-[#e05656] font-bold py-2 rounded-lg text-xs sm:text-sm cursor-pointer hover:bg-[#e05656]/25 transition"
                    >
                      Rejeter
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[11px] sm:text-xs text-[#9aa0aa] pt-2 border-t border-[#232830]">
                    <span>Statut : <strong className="text-white uppercase">{item.statut}</strong></span>
                    <span>Appliqué : {item.applique ? 'Oui ✅' : 'En attente ⏳'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
