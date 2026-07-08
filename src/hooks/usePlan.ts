import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const usePlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPlan(data?.plan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user]);

  return { plan, loading, error };
};

export default usePlan;
