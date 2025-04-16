import "./globals.css";
import GlobalProvider from "@/context/GlobalContext";

export const metadata = {
  title: "MD to PDF",
  description: "App that converts a Markdown file into PDF ebook",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
