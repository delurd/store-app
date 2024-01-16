import Link from 'next/link';
import Navigation from './components/Navigation';
import {Suspense} from 'react';
import Loading from './_loading';

type Props = {};

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="grid grid-cols-12 h-screen">
      <nav className="col-span-2 relative">
        <Navigation />
      </nav>
      <Suspense fallback={<Loading />}>
        <main className="col-span-10 bg-base px-5 md:px-10 pb-8 lg:p-16 lg:pt-0">
          {children}
        </main>
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
