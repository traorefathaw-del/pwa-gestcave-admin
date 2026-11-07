import React from 'react';
import { CheckSquare, Package, ShoppingCart, CreditCard, Tag, BarChart3 } from 'lucide-react';

interface Props {
  tabActif: string;
  setTabActif: (tab: string) => void;
  badgeApprobations: number;
}

export const Navigation: React.FC<Props> = ({ tabActif, setTabActif, badgeApprobations }) => {
  const tabs = [
    { id: 'approbations', label: 'Approbations', icon: CheckSquare, badge: badgeApprobations },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'ventes', label: 'Ventes', icon: ShoppingCart },
    { id: 'dettes', label: 'Crédits', icon: CreditCard },
    { id: 'produits', label: 'Produits', icon: Tag },
    { id: 'rapports', label: 'Rapports', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#11141a] border-t border-[#232830] px-2 py-2 flex justify-around items-center z-50">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = tabActif === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTabActif(t.id)}
            className={`flex flex-col items-center justify-center w-full py-1 relative ${
              isActive ? 'text-[#c9a44a]' : 'text-[#9aa0aa]'
            }`}
          >
            <div className="relative">
              <Icon size={20} />
              {t.badge && t.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-[#e5484d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {t.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[11px] mt-1 font-medium">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
