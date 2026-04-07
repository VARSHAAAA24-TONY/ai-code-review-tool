import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Forensic Toggle: Use a mock client if no real keys are provided
const isMockMode = !supabaseUrl || supabaseUrl.includes('placeholder');

export const supabase = isMockMode ? {
  auth: {
    getSession: async () => {
      const isGuest = localStorage.getItem('sb-guest-session');
      return { 
        data: { session: isGuest ? { user: { id: 'guest-node-01', email: 'guest@forensic.core' } } : null }, 
        error: null 
      };
    },
    getUser: async () => {
      const isGuest = localStorage.getItem('sb-guest-session');
      return { 
        data: { user: isGuest ? { id: 'guest-node-01', email: 'guest@forensic.core' } : null }, 
        error: null 
      };
    },
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => { 
      localStorage.removeItem('sb-guest-session');
      window.location.reload();
      return { error: null };
    },
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          then: (cb) => cb({ data: [], error: null })
        }),
        then: (cb) => cb({ data: [], error: null })
      }),
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
        then: (cb) => cb({ data: [], error: null })
      }),
      then: (cb) => cb({ data: [], error: null })
    }),
    insert: () => ({
      then: (cb) => cb({ error: null })
    }),
  })
} : createClient(supabaseUrl, supabaseAnonKey);
