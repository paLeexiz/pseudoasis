import './globals.css';
import '@/styles/custom.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingHelpButton from '@/components/FloatingHelpButton';
import { Stack_Sans_Headline, Elms_Sans } from 'next/font/google';

// Configuración de fuentes variables 
const stackHeadline = Stack_Sans_Headline({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
});

const elmsSans = Elms_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'A5I5',
  description: 'A5I5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${stackHeadline.className} ${elmsSans.className} flex min-h-screen flex-col antialiased`}>
        <div className="flex flex-col min-h-screen w-full">
          <Navbar />

          <main className="flex-grow w-full">
            {children}
          </main>

          <Footer />
          <FloatingHelpButton/>
        </div>
      </body>
    </html>
  );
}