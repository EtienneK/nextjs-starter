import useSWR from 'swr';

const fetcher = (url: string): Promise<boolean> => fetch(url).then((r) => r.status === 200);

export default function useIsAuthenticated(): { isAuthenticated: boolean; mutate: any } {
  const { data: isAuthenticated, mutate } = useSWR('/api/account/session', fetcher);
  return { isAuthenticated, mutate };
}
