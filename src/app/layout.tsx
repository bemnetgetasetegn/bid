import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONEBID — Your Next Big Win Starts With One Bid",
  description:
    "Ethiopia's premier bidding marketplace. Discover exciting bidding opportunities on technology, electronics, lifestyle products, and vehicles with transparent lowest-unique-bid and highest-bid events.",
  keywords: ["OneBid", "Ethiopia", "Bidding", "Auction", "Electronics", "Addis Ababa", "Telebirr"],
  openGraph: {
    title: "ONEBID — Ethiopia's Premier Bidding Platform",
    description: "Your Next Big Win Starts With One Bid. Participate in verified auctions across Ethiopia.",
    type: "website",
    locale: "en_ET",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F5F3] text-[#111111]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
