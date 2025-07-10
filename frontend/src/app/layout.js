// app/layout.jsx
import { Plus_Jakarta_Sans, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/sonner";
import { Providers } from '@/store/provider';
import AuthGate from '@/modules/shared/AuthGate'



const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${jetbrains.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="font-inter antialiased">
         <Providers>
        
            {/* {children}
          <Toaster position="top-right" richColors closeButton /> */}
         
        <AuthGate>
          
            {children}
          <Toaster position="top-right" richColors closeButton />
          </AuthGate>
        </Providers>
      </body>
    </html>
  );
}