
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
