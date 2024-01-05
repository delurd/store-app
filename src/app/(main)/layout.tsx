import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import React from 'react';

type Props = {};

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      <Navbar />
      <header>
        <div className="h-[115px] w-full bg-white"></div>
      </header>
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
