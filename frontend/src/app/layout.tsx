import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "sonner";

export const metadata = {
  title: "Readoo",
  description: "Readoo",
};

export default function RootLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className="bg-[rgb(var(--background-rgb))]">
        <Navbar />
        <main className="min-h-[calc(100vh-193px)]">{children}</main>
        <Footer />

        <Toaster
          position="top-center"
          offset={42}
          richColors
          toastOptions={{
            style: {
              background: "var(--background)",
              color: "var(--foreground)",
              borderRadius: "8px",
              padding: "12px 16px",
              borderColor: "var(--foreground-15-non-transparent)",
              boxShadow: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
