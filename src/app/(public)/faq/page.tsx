import Link from "next/link";
import { HelpCircle, ChevronRight, Mail, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Frequently Asked Questions — ONEBID",
  description: "Get answers to common questions about bidding, deposits, winning, and rules on ONEBID Ethiopia.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What is ONEBID Ethiopia?",
      a: "ONEBID is an online bidding platform operating in Ethiopia that provides consumers with transparent opportunities to win high-value electronics, smartphones, computers, and vehicles through gamified Lowest Unique Bid competitions and standard auctions.",
    },
    {
      q: "How does the Lowest Unique Bid system work?",
      a: "Unlike typical auctions where the highest spender wins, in Lowest Unique Bid events, the winner is the participant who places the lowest bid that nobody else has placed! If two or more people submit 25.50 ETB, that amount is disqualified. The lowest solitary bid wins.",
    },
    {
      q: "How do I top up my wallet?",
      a: "Go to your User Dashboard > Wallet > Top Up. Select your payment provider (telebirr, CBE Birr, or Awash Bank), complete the transfer through your banking app, and enter the generated Transaction Reference ID into our verification form. Our admin team validates the reference and credits your balance.",
    },
    {
      q: "How long does top-up verification take?",
      a: "Manual verification takes between 5 to 30 minutes during standard operating hours (8:00 AM – 10:00 PM East Africa Time).",
    },
    {
      q: "Can I withdraw my deposited funds?",
      a: "During the current Demonstration Mode, all balances and deposits represent simulated test credits. In production mode, withdrawals are processed according to Ethiopian banking regulations and anti-money-laundering guidelines.",
    },
    {
      q: "How are winners notified?",
      a: "Winners are notified immediately via dashboard alerts, SMS, and telephone calls from our official customer service line (+251 91 123 4567).",
    },
    {
      q: "Where do I collect won items?",
      a: "Physical items can be picked up at our verified distribution hub in Bole, Addis Ababa, or shipped via tracked EMS courier to regional cities (Hawassa, Bahir Dar, Adama, Dire Dawa, Mekelle).",
    },
    {
      q: "What prevents unfair manipulation of bids?",
      a: "All bids are recorded with cryptographic timestamps, user ID binding, and idempotency tokens. In Lowest Unique Bid events, live bid amounts remain completely confidential until event finalization to prevent strategic sniping or collusion.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5A1F] bg-[#111111] px-4 py-1 inline-block text-white">
          Help Center
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#686868] max-w-xl mx-auto">
          Clear answers to help you navigate our bidding platform, deposit procedures, and winner arbitration.
        </p>
      </div>

      {/* Accordion FAQ list */}
      <div className="bg-white border-2 border-[#111111] p-6 sm:p-10 shadow-xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-base sm:text-lg font-black uppercase text-[#111111]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-[#555555] leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Prompt */}
      <div className="bg-[#111111] text-white p-8 border-l-4 border-[#FF5A1F] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase">Still have questions?</h3>
          <p className="text-xs text-[#A0A0A0]">
            Our support agents in Addis Ababa are available 7 days a week.
          </p>
        </div>
        <Link href="/contact">
          <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs px-6 py-5">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}
