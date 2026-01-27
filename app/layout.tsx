import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/Footer";
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from "@clerk/localizations";

const inter = Inter({
  variable: "--font-geist-sans", // Keep variable name for compatibility
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono", // Keep variable name for compatibility
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Festival Strategy App",
  description: "Film festival strategy and theme analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${robotoMono.variable} antialiased`}
        >
          <Providers>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
