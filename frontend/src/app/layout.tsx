import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KartPulse - Go-Kart Pisti Operasyon Yönetimi',
  description:
    'Kart filosu, yarış oturumları, kart bakımı, pist bakımı, kask envanteri ve fiyat kademeleri yönetim platformu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${bebasNeue.variable} ${dmSans.variable} font-sans`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
