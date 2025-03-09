import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Providers from "@/lib/utils/Providers";

export const metadata: Metadata = {
  title: "SUPPLY CHAIN",
  description: "Blockchain Powered supply chain management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
