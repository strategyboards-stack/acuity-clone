import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acuity Clone Preview',
  description: 'Local demo mode for implemented product slices.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
