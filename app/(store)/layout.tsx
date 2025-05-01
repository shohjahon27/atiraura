import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live"
import Footer from "@/components/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-phone-input-2/lib/style.css';

export const metadata: Metadata = {
  title: "atiraura",
  description: "atiraura barcha ehtiyojlaringiz uchun onlayn do'kon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
    <html lang="en">
      <body>
        <main>
          <Header/>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
        <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              />
        </main>

        <SanityLive/>
      <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
