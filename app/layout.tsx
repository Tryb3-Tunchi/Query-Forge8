import type { Metadata } from 'next';
import { dmSerif, jetbrains, spaceGrotesk } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'QueryForge — Visual Query Builder',
  description: 'Build complex database queries visually. No syntax required.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  );
}