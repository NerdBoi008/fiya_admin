import Footer from "@/components/local/Footer";
import Navbar from "@/components/local/Navbar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main>
           <Navbar />
          {children}
          <Footer /> 
        </main>
    );
  }
  