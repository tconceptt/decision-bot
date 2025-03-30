import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // Make sure this is imported

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abby's Little Helper", // Updated Title
  description: "Have a dilemma? Let Abby's Little Helper help you!",
  viewport: "width=device-width, initial-scale=1",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      {/* The 'inter.className' applies font smoothing often.
          The bg/text colors are now handled by globals.css @layer base */}
      <body className={`${inter.className} flex flex-col h-screen`}> {/* Ensure flex layout takes full height */}
        {children}
      </body>
    </html>
  );
}