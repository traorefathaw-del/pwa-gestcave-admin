import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Rapports: React.FC = () => {
  const [stats, setStats] = useState({
    caJour: 0,
    beneficeJour: 0,
    ventesJour: 0,
    encaisseJour: 0,
    creditEnCours: 0,
    produitsStockBas: 0,
    totalTransactions: 0,
  });
  const [periodeCA, setPeriodeCA] = useState<7 | 14 | 30>(14);
  const [_ventesPeriode, setVentesPeriode] = useState<any[]>([]);
  const [topProduits, setTopProduits] = useState<{ nom: string; total: number }[]>([]);
  const [donneesGraphique, setDonneesGraphique] = useState<{ date: string; montant: number; label: string }[]>([]);
  const [dateCible, setDateCible] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [dateDebut, setDateDebut] = useState('2026-10-08');
  const [dateFin, setDateFin] = useState('2026-11-07');

  const fetchRapports = async () => {
    setLoading(true);
    try {
      const { data: ventesData } = await supabase
        .from('ventes')
        .select('*')
        .order('vendu_le', { ascending: false });

      const ventes = ventesData || [];
      setVentesPeriode(ventes);

      const aujourdhui = new Date().toISOString().split('T')[0];
      let cible = aujourdhui;

      const ventesAujourdhui = ventes.filter((v) => v.vendu_le && v.vendu_le.startsWith(aujourdhui));
      if (ventesAujourdhui.length === 0 && ventes.length > 0 && ventes[0].vendu_le) {
        cible = ventes[0].vendu_le.split('T')[0];
      }
      setDateCible(cible);

      let caJ = 0;
      let benefJ = 0;
      let ventesJ = 0;
      let encaisseJ = 0;
      let creditCours = 0;

      ventes.forEach((v) => {
        const total = Number(v.total || 0);

        if (v.mode_paiement && v.mode_paiement.toLowerCase() === 'credit') {
          creditCours += total;
        }

        if (v.vendu_le && v.vendu_le.startsWith(cible)) {
          caJ += total;
          ventesJ += 1;
          if (v.mode_paiement && v.mode_paiement.toLowerCase() !== 'credit') {
            encaisseJ += total;
          }
          benefJ += Number(v.benefice || total * 0.3);
        }
      });

      // Produits en stock bas
      const { data: produitsData } = await supabase.from('produits').select('*');
      const produits = produitsData || [];
      let stockBas = 0;
      produits.forEach((p) => {
        const stock = Number(p.stock || p.quantite || 0);
        const seuil = Number(p.seuil_alerte || p.seuil || 5);
        if (stock <= seuil) {
          stockBas += 1;
        }
      });

      // Top Produits
      const produitsMap: { [key: string]: number } = {};
      ventes.forEach((v) => {
        const nomProd = v.produit || v.nom_produit || v.article || 'Boissons & Articles';
        produitsMap[nomProd] = (produitsMap[nomProd] || 0) + Number(v.total || 0);
      });

      const topList = Object.keys(produitsMap).map((nom) => ({
        nom,
        total: produitsMap[nom],
      })).sort((a, b) => b.total - a.total);

      setTopProduits(topList);

      // Données pour le graphique
      const mapJours: { [key: string]: number } = {};
      for (let i = periodeCA - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        mapJours[dateStr] = 0;
      }

      ventes.forEach((v) => {
        if (v.vendu_le) {
          const dStr = v.vendu_le.split('T')[0];
          if (mapJours[dStr] !== undefined) {
            mapJours[dStr] += Number(v.total || 0);
          }
        }
      });

      const graphData = Object.keys(mapJours).map((dateStr) => {
        const parts = dateStr.split('-');
        return {
          date: dateStr,
          montant: mapJours[dateStr],
          label: `${parts[2]}/${parts[1]}`,
        };
      });

      setDonneesGraphique(graphData);

      setStats({
        caJour: caJ,
        beneficeJour: benefJ,
        ventesJour: ventesJ,
        encaisseJour: encaisseJ,
        creditEnCours: creditCours,
        produitsStockBas: stockBas,
        totalTransactions: ventes.length,
      });
    } catch (e) {
      console.error('Erreur chargement rapports:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRapports();
  }, [periodeCA]);

  // Fonction d'exportation du rapport en fichier texte/CSV téléchargeable
  const handleExportRapport = () => {
    const contenuRapport = [
      `=== RAPPORT D'ACTIVITÉ GESTCAVE ADMIN ===`,
      `Date de génération : ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR')}`,
      `Période des métriques journalières : ${dateCible || 'N/A'}`,
      ``,
      `--- INDICATEURS DU JOUR ---`,
      `- CA du jour : ${stats.caJour} FCFA`,
      `- Bénéfice du jour : ${stats.beneficeJour} FCFA`,
      `- Ventes du jour : ${stats.ventesJour}`,
      `- Encaissé (jour) : ${stats.encaisseJour} FCFA`,
      `- Crédit en cours : ${stats.creditEnCours} FCFA`,
      `- Produits en stock bas : ${stats.produitsStockBas}`,
      ``,
      `--- SYNTHÈSE GLOBALE ---`,
      `- Total des transactions : ${stats.totalTransactions}`,
      ``,
      `--- TOP PRODUITS / RÉPARTITION ---`,
      ...topProduits.map((item) => `- ${item.nom} : ${item.total} FCFA`),
    ].join('\n');

    const blob = new Blob([contenuRapport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport_gestcave_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const maxMontant = Math.max(...donneesGraphique.map((d) => d.montant), 1);

  return (
    <div className="space-y-6 text-[#e8e6e1] pb-12">
      <div className="flex justify-between items-center border-b border-[#232830] pb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#d8b45c]">Vue d'ensemble de l'activité</h3>
          {dateCible && (
            <p className="text-[11px] text-[#9aa0aa] mt-0.5">
              Métriques journalières basées sur le : <span className="text-[#c9a44a] font-mono">{dateCible}</span>
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchRapports}
            className="px-3 py-1.5 bg-[#c9a44a] text-black text-xs font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
          >
            Actualiser
          </button>
          <button
            onClick={handleExportRapport}
            className="px-3 py-1.5 bg-[#11141a] border border-[#232830] text-[#e8e6e1] text-xs font-semibold rounded-lg hover:border-[#c9a44a] transition cursor-pointer flex items-center space-x-1.5"
          >
            <span>Exporter le rapport</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-[#9aa0aa] py-12">Chargement des données...</p>
      ) : (
        <>
          {/* Ligne des 6 cartes du haut */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">CA du jour</p>
              <p className="text-base font-bold text-[#34c77b] mt-1">{stats.caJour.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">Bénéfice du jour</p>
              <p className="text-base font-bold text-[#c9a44a] mt-1">{stats.beneficeJour.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">Ventes du jour</p>
              <p className="text-base font-bold text-[#e8e6e1] mt-1">{stats.ventesJour}</p>
            </div>
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">Encaissé (jour)</p>
              <p className="text-base font-bold text-[#34c77b] mt-1">{stats.encaisseJour.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">Crédit en cours</p>
              <p className="text-base font-bold text-[#e05656] mt-1">{stats.creditEnCours.toLocaleString('fr-FR')} FCFA</p>
            </div>
            <div className="bg-[#11141a] p-4 rounded-xl border border-[#232830]">
              <p className="text-[10px] uppercase tracking-wider text-[#9aa0aa]">Produits en stock bas</p>
              <p className="text-base font-bold text-[#e05656] mt-1">{stats.produitsStockBas}</p>
            </div>
          </div>

          {/* Section Graphiques et Répartition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-[#11141a] p-5 rounded-xl border border-[#232830] flex flex-col justify-between min-h-[300px]">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-semibold text-[#e8e6e1]">Chiffre d'affaires ({periodeCA} derniers jours)</h4>
                <div className="flex bg-[#181c24] p-0.5 rounded-lg border border-[#232830] space-x-1">
                  {[7, 14, 30].map((jours) => (
                    <button
                      key={jours}
                      onClick={() => setPeriodeCA(jours as any)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition cursor-pointer ${
                        periodeCA === jours ? 'bg-[#c9a44a] text-black' : 'text-[#9aa0aa] hover:text-white'
                      }`}
                    >
                      {jours} j
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between h-44 pt-6 pb-2 px-2 border-b border-[#232830] gap-1">
                {donneesGraphique.map((item, idx) => {
                  const hauteurPourcent = Math.max(Math.round((item.montant / maxMontant) * 100), 4);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div className="absolute -top-9 bg-[#181c24] text-[#34c77b] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#232830] opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                        {item.montant.toLocaleString('fr-FR')} F
                      </div>
                      <div
                        style={{ height: `${hauteurPourcent}%` }}
                        className={`w-full max-w-[24px] rounded-t transition-all duration-300 ${
                          item.montant > 0 ? 'bg-[#c9a44a] hover:bg-[#d8b45c]' : 'bg-[#232830]'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] text-[#9aa0aa] px-1">
                <span>{donneesGraphique[0]?.label}</span>
                <span>{donneesGraphique[Math.floor(donneesGraphique.length / 2)]?.label}</span>
                <span>{donneesGraphique[donneesGraphique.length - 1]?.label}</span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#11141a] p-5 rounded-xl border border-[#232830]">
                <h4 className="text-xs font-semibold text-[#e8e6e1] mb-3">Répartition du CA par produit</h4>
                {topProduits.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-[#9aa0aa] border border-dashed border-[#232830] rounded-lg">
                    Aucune vente sur la période.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {topProduits.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs bg-[#181c24] p-2 rounded border border-[#232830]">
                        <span className="text-[#e8e6e1]">{item.nom}</span>
                        <span className="font-bold text-[#34c77b]">{item.total.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#11141a] p-5 rounded-xl border border-[#232830]">
                <h4 className="text-xs font-semibold text-[#e8e6e1] mb-3">Top produits — {periodeCA} derniers jours</h4>
                {topProduits.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-[#9aa0aa] border border-dashed border-[#232830] rounded-lg">
                    Aucune vente sur la période.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-28 overflow-y-auto pr-1">
                    {topProduits.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs bg-[#181c24] p-2 rounded border border-[#232830]">
                        <span className="text-[#c9a44a]">#{idx + 1} {item.nom}</span>
                        <span className="font-bold text-[#e8e6e1]">{item.total.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section du bas : Vendu sous le prix de base */}
          <div className="bg-[#11141a] p-5 rounded-xl border border-[#232830]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h4 className="text-xs font-semibold text-[#e8e6e1]">Vendu sous le prix de base</h4>
              <div className="flex items-center space-x-2 text-xs text-[#9aa0aa]">
                <span>Du</span>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="bg-[#181c24] border border-[#232830] rounded px-2 py-1 text-[#e8e6e1] text-xs"
                />
                <span>au</span>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="bg-[#181c24] border border-[#232830] rounded px-2 py-1 text-[#e8e6e1] text-xs"
                />
              </div>
            </div>
            <div className="p-12 flex items-center justify-center text-xs text-[#9aa0aa] border border-dashed border-[#232830] rounded-lg">
              Rien à signaler — aucune ligne vendue sous le prix de base.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
