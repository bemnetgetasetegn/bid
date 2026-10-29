import Link from "next/link";
import { Gavel, Phone, Mail, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { HalftonePattern } from "@/components/ui/halftone-pattern";

export function Footer() {
  return (
    <footer className="relative bg-[#111111] text-white border-t-4 border-[#FF5A1F] overflow-hidden">
      {/* Decorative Halftone Pattern */}
      <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
        <HalftonePattern variant="corner" color="#FF5A1F" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#FF5A1F] text-white p-2">
                <Gavel className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">
                <span className="text-[#FF5A1F]">ONE</span>BID
              </span>
            </div>
            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Ethiopia’s premiere online auction and lowest-unique-bid competition platform. Experience transparent, secure, and exciting bidding on electronics, smartphones, and vehicles.
            </p>
            <div className="pt-2 text-xs text-[#FF5A1F] font-bold uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Certified Transparent Bidding Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white border-b-2 border-[#FF5A1F] pb-2 mb-4 inline-block">
              Explore Auctions
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A0A0A0]">
              <li>
                <Link href="/bids" className="hover:text-[#FF5A1F] transition-colors flex items-center group">
                  <span className="text-[#FF5A1F] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Live Bidding Events
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="hover:text-[#FF5A1F] transition-colors flex items-center group">
                  <span className="text-[#FF5A1F] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Upcoming Auctions
                </Link>
              </li>
              <li>
                <Link href="/completed" className="hover:text-[#FF5A1F] transition-colors flex items-center group">
                  <span className="text-[#FF5A1F] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Past Results
                </Link>
              </li>
              <li>
                <Link href="/winners" className="hover:text-[#FF5A1F] transition-colors flex items-center group">
                  <span className="text-[#FF5A1F] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  Verified Winners
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#FF5A1F] transition-colors flex items-center group">
                  <span className="text-[#FF5A1F] mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  How Lowest Unique Bid Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white border-b-2 border-[#FF5A1F] pb-2 mb-4 inline-block">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A0A0A0]">
              <li>
                <Link href="/faq" className="hover:text-[#FF5A1F] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF5A1F] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FF5A1F] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF5A1F] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-[#333333]">
              <span className="text-xs uppercase font-bold text-[#FF5A1F] block mb-1">
                Accepted Payment References
              </span>
              <p className="text-xs text-[#888888]">
                telebirr • CBE Birr • Awash Bank • Bank of Abyssinia
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-white border-b-2 border-[#FF5A1F] pb-2 mb-4 inline-block">
              Office & Helpdesk
            </h4>
            <div className="flex items-start space-x-3 text-sm text-[#A0A0A0]">
              <MapPin className="h-4 w-4 text-[#FF5A1F] shrink-0 mt-0.5" />
              <span>Bole Sub-City, Namibia Street, Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-[#A0A0A0]">
              <Phone className="h-4 w-4 text-[#FF5A1F] shrink-0" />
              <span>+251 91 123 4567 / +251 11 654 3210</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-[#A0A0A0]">
              <Mail className="h-4 w-4 text-[#FF5A1F] shrink-0" />
              <span>support@onebid.et</span>
            </div>
          </div>
        </div>

        {/* Disclaimer / Regulatory Note */}
        <div className="mt-12 pt-8 border-t border-[#262626] text-xs text-[#777777] leading-relaxed">
          <p className="mb-2">
            <strong className="text-[#FF5A1F]">LEGAL COMPLIANCE NOTICE:</strong> Real-money bidding and settlement remain in Demonstration Mode until applicable trade authorizations and national lottery / consumer promotion licenses are confirmed. All balances shown in demo mode represent simulated points for testing and evaluation purposes.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-[#1C1C1C] text-[11px]">
            <span>© 2026 ONEBID Ethiopia PLC. All rights reserved.</span>
            <span className="mt-2 md:mt-0 font-medium">
              Designed with precision for the Ethiopian Digital Economy.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
