import Link from "next/link";
import { Gavel, Trophy, HelpCircle, CheckCircle2, ShieldCheck, ArrowRight, Zap, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works — ONEBID Ethiopia",
  description: "Learn how Lowest Unique Bid competitions and Standard Auctions work on ONEBID.",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5A1F] bg-[#111111] px-4 py-1.5 inline-block text-white">
          The Official Guide
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
          How ONEBID Works
        </h1>
        <p className="text-base text-[#686868] leading-relaxed">
          ONEBID operates on game-theoretic bidding models where strategy, patience, and uniqueness allow everyday participants to win premium technology and vehicles for minuscule amounts.
        </p>
      </div>

      {/* The Two Bidding Formats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Model 1: Lowest Unique Bid */}
        <div className="bg-white border-2 border-[#111111] p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF5A1F]" />
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#FF5A1F] text-white">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block">
                Primary Strategy Mode
              </span>
              <h2 className="text-2xl font-black uppercase text-[#111111]">
                Lowest Unique Bid
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#444444] leading-relaxed">
            In a Lowest Unique Bid competition, the winner is the bidder who submits an amount that meets <strong>two strict conditions</strong>:
          </p>

          <div className="space-y-3 bg-[#F5F5F3] p-4 border border-[#E5E5E5] text-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Condition 1: Uniqueness</strong> — No other participant in the entire competition submitted that exact same bid amount.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Condition 2: Lowest Position</strong> — Among all the unique bids that exist when the timer expires, yours is the lowest in value.
              </div>
            </div>
          </div>

          {/* Example Illustration Table */}
          <div className="border border-[#111111]">
            <div className="bg-[#111111] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
              Example Simulation:
            </div>
            <div className="p-4 space-y-2 text-xs divide-y divide-[#E5E5E5]">
              <div className="flex justify-between py-1">
                <span className="font-mono font-bold">0.50 ETB</span>
                <span className="text-[#DC2626] font-bold">Bid by 3 users (Eliminated — Not unique)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-mono font-bold">1.20 ETB</span>
                <span className="text-[#DC2626] font-bold">Bid by 2 users (Eliminated — Not unique)</span>
              </div>
              <div className="flex justify-between py-1 bg-[#16803C]/10 px-2 font-bold text-[#16803C]">
                <span className="font-mono font-black">1.85 ETB</span>
                <span>Bid by exactly 1 user (WINNER!)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-mono font-bold">2.40 ETB</span>
                <span className="text-[#686868]">Bid by 1 user (Unique, but 1.85 is lower)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model 2: Highest Bid Auction */}
        <div className="bg-white border-2 border-[#111111] p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#111111]" />
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#111111] text-white">
              <Gavel className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#686868] uppercase tracking-wider block">
                Traditional Format
              </span>
              <h2 className="text-2xl font-black uppercase text-[#111111]">
                Highest Bid Auction
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#444444] leading-relaxed">
            Standard ascending auctions where participants place public or incremental bids on high-value items until the final second.
          </p>

          <div className="space-y-3 bg-[#F5F5F3] p-4 border border-[#E5E5E5] text-xs">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Public Price Discovery</strong> — Every new bid must exceed the prior leading bid by at least the specified minimum increment.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#16803C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111]">Closing Lock</strong> — When the countdown clock hits 00:00:00, the highest verified bidder secures the item at their final price.
              </div>
            </div>
          </div>

          <div className="border border-[#111111]">
            <div className="bg-[#111111] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
              Auction Key Attributes:
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                <span className="font-bold text-[#686868]">Anti-Sniping Protection:</span>
                <span className="font-bold text-[#111111]">Timer resets by 60s if bid in final minute</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E5E5]">
                <span className="font-bold text-[#686868]">Currency:</span>
                <span className="font-bold text-[#111111]">Ethiopian Birr (ETB)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-bold text-[#686868]">Wallet Settlement:</span>
                <span className="font-bold text-[#111111]">Automatic refund for outbid users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Steps Section */}
      <div className="bg-[#111111] text-white p-10 lg:p-16 border-2 border-[#FF5A1F]">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            The User Journey
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Step-By-Step Participation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-5xl font-black text-[#FF5A1F] font-mono">01</span>
            <h4 className="text-lg font-black uppercase">Create Profile</h4>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Register using your phone number (+251). Your personal wallet is established automatically.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-5xl font-black text-white font-mono">02</span>
            <h4 className="text-lg font-black uppercase">Load Balance</h4>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Transfer funds via telebirr, CBE Birr, or Awash Bank. Submit transaction ID for prompt admin credit.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-5xl font-black text-[#FF5A1F] font-mono">03</span>
            <h4 className="text-lg font-black uppercase">Submit Bids</h4>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Pick an active live event. Enter your strategic bid and pay the nominal participation fee.
            </p>
          </div>
          <div className="space-y-3">
            <span className="text-5xl font-black text-white font-mono">04</span>
            <h4 className="text-lg font-black uppercase">Claim Prize</h4>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              At closing, the backend calculates the winner. Verified winners collect items at our Addis Ababa hub.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs link banner */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-black uppercase text-[#111111]">
          Have More Questions?
        </h3>
        <p className="text-sm text-[#686868]">
          Find answers regarding wallet deposits, rule arbitration, and delivery timelines.
        </p>
        <Link href="/faq">
          <Button className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-bold uppercase text-xs px-8 py-5">
            Read Frequently Asked Questions
          </Button>
        </Link>
      </div>
    </div>
  );
}
