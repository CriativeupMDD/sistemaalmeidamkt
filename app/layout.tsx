import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sistema Clínica",
    template: "%s | Sistema Clínica"
  },
  description: "SaaS multi-clínicas para gestão comercial, operacional e financeira."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
