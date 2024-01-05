'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {SessionProvider} from 'next-auth/react';
import React, {ReactNode, useState} from 'react';

type Props = {};

const Providers = ({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) => {
  const [queryClient] = useState(new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
