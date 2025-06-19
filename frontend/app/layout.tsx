import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disaster Response Coordination Platform',
  description: 'Coordinate disaster relief efforts in real time',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="bumblebee">
      <body className="font-sans bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}