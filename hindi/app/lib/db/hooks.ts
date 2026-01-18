import { useEffect, useState } from 'react';
import { seedDatabase } from './seed';

export function useEnsureSeeded(): { isSeeded: boolean; isLoading: boolean; error: Error | null } {
  const [isSeeded, setIsSeeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function seed() {
      try {
        await seedDatabase();
        if (isMounted) {
          setIsSeeded(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to seed database'));
          setIsLoading(false);
        }
      }
    }

    seed();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isSeeded, isLoading, error };
}
