import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useAgency = () => {
  const { user } = useAuth();
  const [agency, setAgency] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAgency = async () => {
      try {
        const { data, error } = await supabase
          .from('agencies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setAgency(data);
      } catch (err) {
        setError((err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [user]);

  return { agency, loading, error };
};

export default useAgency;
