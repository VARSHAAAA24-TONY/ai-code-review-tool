import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-space-mono' });

export const metadata: Metadata = {
  title: "AI Personal OS | The Holographic Void",
  description: "A futuristic, AI-powered personal productivity platform.",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceMono.variable}`}>
        {children}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'rgba(10, 15, 28, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#E0E0E0',
            backdropFilter: 'blur(10px)'
          }
        }} />
      </body>
    </html>
  );
}
