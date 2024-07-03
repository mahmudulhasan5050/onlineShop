'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/trpc/client';
import { httpBatchLink } from '@trpc/client';

// this function allows to use tRPC library through out the frontend
//children: ReactNode is same as PropsWithChildren
const Providers = ({children}: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  //wrap react-query with trpc
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {/* QueryClientProvider is coming from tanstack/react-query */}
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
};

export default Providers;
