import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Produit {
  id: string;
  nom: string;
  sku?: string;
  categorie?: string;
  prix_achat: number;
  prix_vente: number;
  stock: number;
  seuil_alerte: number;
  actif: boolean;
}

const formatFCFA = (valeur: number) => {
  return `${Number(valeur || 0).toLocaleString('fr-FR')} FCFA`;
};

export const Produits: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);

  // Form state
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [stock, setStock] = useState('');
  const [seuilAlerte, setSeuilAlerte] = useState('5');

  const fetchProduits = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('produits')
      .select('*')
      .is('deleted_at', null)
      .order('nom', { ascending: true });

    setProduits(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const ouvrirModalAjout = () => {
    setEditingProduit(null);
    setNom('');
    setCategorie('');
    setPrixAchat('');
    setPrixVente('');
    setStock('');
    setSeuilAlerte('5');
    setIsModalOpen(true);
  };

  const ouvrirModalEdition = (p: Produit) => {
    setEditingProduit(p);
    setNom(p.nom);
    setCategorie(p.categorie || '');
    setPrixAchat(p.prix_achat.toString());
    setPrixVente(p.prix_vente.toString());
    setStock(p.stock.toString());
    setSeuilAlerte((p.seuil_alerte ?? 5).toString());
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !prixVente) return;

    const payload = {
      nom,
      categorie: categorie || 'Général',
      prix_achat: parseFloat(prixAchat) || 0,
      prix_vente: parseFloat(prixVente) || 0,
      stock: parseInt(stock) || 0,
      seuil_alerte: parseInt(seuilAlerte) || 5,
      actif: true,
      updated_at: new Date().toISOString(),
    };

    if (editingProduit) {
      await supabase.from('produits').update(payload).eq('id', editingProduit.id);
    } else {
      await supabase.from('produits').insert([payload]);
    }

    setIsModalOpen(false);
    fetchProduits();
  };

  const supprimerProduit = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    await supabase.from('produits').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    fetchProduits();
  };

  const produitsFiltres = produits.filter(p => 
    p.nom.toLowerCase().includes(recherche.toLowerCase()) || 
    (p.categorie && p.categorie.toLowerCase().includes(recherche.toLowerCase()))
  );

  return (
    <div className="p-4 pb-24 text-[#e8e6e1]">
      {/* Barre d'action et recherche */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit ou une catégorie..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full sm:w-72 bg-[#161a20] border border-[#232830] px-4 py-2 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
        />
        <button
          onClick={ouvrirModalAjout}
          className="w-full sm:w-auto bg-[#c9a44a] text-[#0b0d10] font-bold px-4 py-2 rounded-xl text-sm cursor-pointer hover:opacity-90 transition"
        >
          + Nouveau Produit
        </button>
      </div>

      {/* Liste des produits */}
      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12">Chargement du catalogue...</p>
      ) : produitsFiltres.length === 0 ? (
        <p className="text-center text-[#9aa0aa] py-12">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produitsFiltres.map((p) => (
            <div key={p.id} className="bg-[#161a20] border border-[#232830] p-4 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white text-base">{p.nom}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#232830] text-[#c9a44a]">
                    {p.categorie || 'Vin'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[#9aa0aa] mb-4">
                  <p>Prix d'achat : <span className="text-white">{formatFCFA(p.prix_achat)}</span></p>
                  <p>Prix de vente : <span className="text-[#34c77b] font-bold">{formatFCFA(p.prix_vente)}</span></p>
                  <p>Stock actuel : <span className={`font-bold ${p.stock <= p.seuil_alerte ? 'text-[#e5484d]' : 'text-white'}`}>{p.stock} unités</span></p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#232830]">
                <button
                  onClick={() => ouvrirModalEdition(p)}
                  className="flex-1 bg-[#232830] hover:bg-[#2c323d] text-white py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => supprimerProduit(p.id)}
                  className="px-3 bg-[#e5484d]/10 hover:bg-[#e5484d]/20 text-[#e5484d] py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajout / Édition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#161a20] border border-[#232830] w-full max-w-md p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingProduit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9aa0aa] mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Chianti Classico"
                  className="w-full bg-[#11141a] border border-[#232830] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#9aa0aa] mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    placeholder="Ex: Rouge, Blanc..."
                    className="w-full bg-[#11141a] border border-[#232830] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9aa0aa] mb-1">Stock initial</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#11141a] border border-[#232830] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#9aa0aa] mb-1">Prix d'achat (FCFA)</label>
                  <input
                    type="number"
                    value={prixAchat}
                    onChange={(e) => setPrixAchat(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#11141a] border border-[#232830] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9aa0aa] mb-1">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={prixVente}
                    onChange={(e) => setPrixVente(e.target.value)}
                    placeholder="0"
                    className="w-full bg-[#11141a] border border-[#2328json] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9aa0aa] mb-1">Seuil d'alerte stock</label>
                <input
                  type="number"
                  value={seuilAlerte}
                  onChange={(e) => setSeuilAlerte(e.target.value)}
                  className="w-full bg-[#11141a] border border-[#232830] p-2.5 rounded-xl text-sm text-white focus:outline-none focus:border-[#c9a44a]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-[#232830] hover:bg-[#2c323d] text-white py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#c9a44a] text-[#0b0d10] py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:opacity-90 transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
