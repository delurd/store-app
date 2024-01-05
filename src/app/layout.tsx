import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import {getServerSession} from 'next-auth';
import 'react-toastify/dist/ReactToastify.css';
import NextTopLoader from 'nextjs-toploader';
import {ToastContainer} from 'react-toastify';
import {authOptions} from './api/auth/[...nextauth]/action';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Allstore',
  description: 'Place to sell and buy various goods',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" style={{overflow: 'hidden'}}>
      <body className={inter.className + ' ' + 'h-screen overflow-y-scroll'}>
        <NextTopLoader color="#29A867" showSpinner={false} />
        <div className="h-full flex flex-col">
          <Providers session={session}>{children}</Providers>
        </div>
        <ToastContainer
          className={'z-50'}
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
        />
      </body>
    </html>
  );
}
