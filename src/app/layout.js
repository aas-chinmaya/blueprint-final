"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import {Toaster} from "@/components/ui/sonner";

import { Providers } from "@/store/providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body
      cz-shortcut-listen="true"  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Providers>
            {children}
            <Toaster position="top-right" richColors closeButton/>
          </Providers>
      </body>
    </html>
  );
}
