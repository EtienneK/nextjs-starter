import useSWR from 'swr';

interface Wrapper {
  isAuthenticated: boolean;
}

const fetcher = (url: string): Promise<Wrapper> => fetch(url)
  .then((r) => r.status === 200)
  .then((isAuthenticated) => ({ isAuthenticated }));

export default function useIsAuthenticated(): {
  data: Wrapper;
  mutate: (isAuthenticated: boolean) => Promise<Wrapper>;
} {
  const { data, mutate: wrappedMutate } = useSWR('/api/account/session', fetcher);
  return {
    data,
    mutate: (isAuthenticated: boolean): Promise<Wrapper> => wrappedMutate({ isAuthenticated }),
  };
}
