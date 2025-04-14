import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/context/GlobalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MD to PDF",
  description: "App that converts a Markdown file into PDF ebook",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
