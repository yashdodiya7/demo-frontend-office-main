'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header";
import { Footer } from "@/components/footer";
import { Provider } from "react-redux";
import storeObj from "@/store/store";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const {store} = storeObj  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBLeAvWMxpPVw2yRJgz1xN-EkNeGFhxt1E&libraries=places&callback=initMap' async></script>
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
