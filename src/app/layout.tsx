import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AmplifyProvider from '@/components/AmplifyProvider';
import '@aws-amplify/ui-react/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Realtime Chat App',
  description: 'A modern real-time chat application built with Next.js and AWS Amplify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyProvider>
          {children}
          <Toaster position="top-right" />
        </AmplifyProvider>
      </body>
    </html>
  );
}