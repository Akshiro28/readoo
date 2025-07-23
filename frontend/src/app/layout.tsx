import "./globals.css";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[calc(100vh-193px)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
