import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const commissioner = localFont({
  src: "./fonts/Commissioner.ttf",
  variable: "--font-commissioner",
  weight: "100 500 600 700",
});
export const syne = localFont({
  src: "./fonts/Syne.ttf",
  variable: "--font-syne",
  weight: "600 700 800 900",
});

export const metadata: Metadata = {
  title: "Tufts Solar Dashboard",
  description: "Dashboard for the Tufts Solar Vehicle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${commissioner.variable} ${syne.variable} font-sans antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
