import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ggqaoeorxnenczkpjoqv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Retourne la date actuelle au format ISO UTC (YYYY-MM-DDTHH:mm:ss.sssZ)
 * RÈGLE STRICTE : À passer dans `updated_at` à chaque UPDATE.
 */
export const now = () => new Date().toISOString();

/**
 * Formate un montant en FCFA selon la locale fr-FR (entiers uniquement).
 */
export const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.trunc(amount)) + ' FCFA';
};
