import useSWR from 'swr';

interface User {
  id: string;
  email: string;
}

interface UserWrapper {
  user?: User;
}

const fetcher = async (url: string): Promise<UserWrapper> => {
  const response = await fetch(url);
  if (response.status === 200) {
    return { user: await response.json() };
  }
  return {};
};

export default function useIsAuthenticated(): {
  wrappedUser: UserWrapper;
  mutate: (user: User) => Promise<UserWrapper>;
} {
  const { data, mutate: wrappedMutate } = useSWR('/api/account/me', fetcher);
  return {
    wrappedUser: data,
    mutate: (user?: User): Promise<UserWrapper> => wrappedMutate({ user }),
  };
}
