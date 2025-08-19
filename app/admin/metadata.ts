import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Zemenay Blog',
  description: 'Admin dashboard for managing the Zemenay Blog content',
  metadataBase: new URL('http://localhost:3000'),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};
