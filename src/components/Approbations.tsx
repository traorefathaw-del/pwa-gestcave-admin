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
    <div className="p-4 pb-24 text-[#e8e6e1]">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setVue('attente')}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm cursor-pointer ${
            vue === 'attente' ? 'bg-[#c9a44a] text-[#0b0d10]' : 'bg-[#161a20] text-[#9aa0aa]'
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setVue('historique')}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm cursor-pointer ${
            vue === 'historique' ? 'bg-[#c9a44a] text-[#0b0d10]' : 'bg-[#161a20] text-[#9aa0aa]'
          }`}
        >
          Historique
        </button>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-8">Chargement...</p>
      ) : demandes.length === 0 ? (
        <p className="text-center text-[#9aa0aa] py-8">Aucune demande trouvée.</p>
      ) : (
        <div className="space-y-3">
          {demandes.map((item) => (
            <div key={item.id} className="bg-[#161a20] border border-[#232830] p-4 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{item.produit_nom}</h3>
                <span className="text-xs px-2 py-1 rounded bg-[#232830] text-[#c9a44a]">
                  {item.type}
                </span>
              </div>

              <p className="text-sm text-[#9aa0aa] mb-2">
                Demandé par : <span className="text-white font-medium">{item.demande_par}</span>
              </p>

              <div className="bg-[#11141a] p-3 rounded-lg mb-3 border border-[#232830]">
                {item.type === 'entree_stock' && <p className="text-sm">Ajout stock : +{item.valeur} unités</p>}
                {item.type === 'modif_stock' && <p className="text-sm">Ajustement : {item.ancien} → {item.valeur} unités</p>}
                {item.type === 'modif_prix' && (
                  <p className="text-sm">Nouveau prix : {formatFCFA(item.ancien)} → <span className="text-[#34c77b] font-bold">{formatFCFA(item.valeur)}</span></p>
                )}
                {item.note && <p className="text-xs text-[#9aa0aa] mt-1">Motif : "{item.note}"</p>}
              </div>

              {vue === 'attente' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => traiterDemande(item.id, 'approuve')}
                    className="flex-1 bg-[#34c77b] text-black font-bold py-2 rounded-lg text-sm cursor-pointer hover:opacity-95"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => {
                      const motif = prompt('Motif du rejet (optionnel) :');
                      traiterDemande(item.id, 'rejete', motif || undefined);
                    }}
                    className="flex-1 bg-[#e5484d] text-white font-bold py-2 rounded-lg text-sm cursor-pointer hover:opacity-95"
                  >
                    Rejeter
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs text-[#9aa0aa]">
                  <span>Statut : <strong className="text-white uppercase">{item.statut}</strong></span>
                  <span>Appliqué caisse : {item.applique ? 'Oui ✅' : 'En attente ⏳'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
