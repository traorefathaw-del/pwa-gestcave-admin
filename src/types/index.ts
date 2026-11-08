export interface Produit {
  id: string;
  nom: string;
  sku?: string;
  categorie?: string;
  prix_achat: number;
  prix_vente: number;
  stock: number;
  seuil_alerte: number;
  actif: boolean;
  updated_at: string;
  deleted_at: string | null;
}

export interface Approbation {
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

export interface MouvementStock {
  id: string;
  produit_id: string;
  produit_nom: string;
  type: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  ancien_stock: number;
  nouveau_stock: number;
  motif?: string;
  note?: string; // <--- Ajouté ici pour correspondre à StockMouvements.tsx
  cree_le: string;
}

export interface Vente {
  id: string;
  numero: string;
  total: number;
}
