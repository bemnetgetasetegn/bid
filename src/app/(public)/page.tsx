import Link from "next/link";

export const dynamic = 'force-dynamic';
import { Gavel, Trophy, ShieldCheck, Sparkles, ArrowRight, Smartphone, Laptop, Tv, Gamepad2, Car, Watch, HelpCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiddingCard } from "@/components/public/bidding-card";
import { HalftonePattern } from "@/components/ui/halftone-pattern";
import { getBiddingItems } from "@/lib/services/bidding.service";

export default async function HomePage() {
  const liveItems = await getBiddingItems({ status: "ACTIVE" });
  const upcomingItems = await getBiddingItems({ status: "UPCOMING" });
  const completedItems = await getBiddingItems({ status: "COMPLETED" });

  const categories = [
    { name: "Smartphones", slug: "smartphones", icon: Smartphone, count: "12 Events" },
    { name: "Computers", slug: "computers", icon: Laptop, count: "8 Events" },
    { name: "Electronics", slug: "electronics", icon: Tv, count: "15 Events" },
    { name: "Gaming", slug: "gaming", icon: Gamepad2, count: "6 Events" },
    { name: "Vehicles", slug: "vehicles", icon: Car, count: "4 Events" },
    { name: "Home & Lifestyle", slug: "home-lifestyle", icon: Watch, count: "9 Events" },
  ];

  return (
    <div className="flex flex-col">
      {/* ============================================================ */}
      {/* HERO SECTION: Editorial High-Contrast Black & Orange         */}
      {/* ============================================================ */}
      <section className="relative bg-[#111111] text-white overflow-hidden py-20 lg:py-28 border-b-4 border-[#FF5A1F]">
        {/* Halftone Pattern Accent in Background */}
        <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
          <HalftonePattern variant="corner" color="#FF5A1F" />
        </div>
        <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
          <HalftonePattern variant="corner" color="#FFFFFF" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-[#1B1B1B] border border-[#333333] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
                <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
                <span>Next Generation Bidding In Ethiopia</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                Your Next Big Win Starts With{" "}
                <span className="text-[#FF5A1F] underline decoration-4 underline-offset-8">
                  One Bid.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#A0A0A0] max-w-xl leading-relaxed">
                Discover exciting bidding opportunities on technology, electronics, lifestyle products, and more. Participate in transparent lowest-unique-bid and standard auction events across Ethiopia.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link href="/bids">
                  <Button className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-black text-sm uppercase tracking-widest px-8 py-6 shadow-xl transition-all">
                    <span>EXPLORE LIVE BIDS</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#111111] font-bold text-sm uppercase tracking-widest px-8 py-6 transition-all"
                  >
                    HOW IT WORKS
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-[#262626] grid grid-cols-3 gap-4 text-xs font-bold uppercase tracking-wider text-[#777777]">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-[#FF5A1F]" />
                  <span>Fair Play Engine</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF5A1F]" />
                  <span>ETB Currency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-[#FF5A1F]" />
                  <span>Verified Winners</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Hero Product Spotlight */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[#1B1B1B] border-2 border-[#FF5A1F] p-4 sm:p-6 shadow-2xl relative">
                {/* Halftone Accent Badge */}
                <div className="absolute -top-4 -right-4 bg-[#FF5A1F] text-white font-black text-xs uppercase px-4 py-2 tracking-widest shadow-lg">
                  HOTTEST EVENT
                </div>

                <div className="relative h-72 sm:h-80 w-full overflow-hidden mb-4 bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800"
                    alt="iPhone 16 Pro Max"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#111111]/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-[#333333]">
                    Lowest Unique Bid Pool
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#A0A0A0] uppercase">
                    <span>iPhone 16 Pro Max 256GB</span>
                    <span className="text-[#FF5A1F]">Entry: 50.00 ETB</span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-white">
                    Brand New Desert Titanium
                  </h3>
                  <p className="text-xs text-[#888888]">
                    Current lowest unique entry wins. Closes in 3 days.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#262626]">
                  <Link href="/bids/iphone-16-pro-max-desert-titanium">
                    <Button className="w-full bg-white hover:bg-[#FF5A1F] text-[#111111] hover:text-white font-extrabold uppercase text-xs tracking-wider py-5 transition-colors">
                      Enter Auction Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STATS BAR: Bold Editorial Numbers                             */}
      {/* ============================================================ */}
      <section className="bg-white border-b-2 border-[#E5E5E5] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r-0 sm:border-r border-[#E5E5E5]">
              <span className="block text-3xl sm:text-4xl font-black text-[#111111] font-mono">
                12,850+
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
                Bids Placed
              </span>
            </div>
            <div className="p-4 border-r-0 lg:border-r border-[#E5E5E5]">
              <span className="block text-3xl sm:text-4xl font-black text-[#111111] font-mono">
                {liveItems.length}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
                Active Events
              </span>
            </div>
            <div className="p-4 border-r-0 sm:border-r border-[#E5E5E5]">
              <span className="block text-3xl sm:text-4xl font-black text-[#111111] font-mono">
                142+
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
                Happy Winners
              </span>
            </div>
            <div className="p-4">
              <span className="block text-3xl sm:text-4xl font-black text-[#111111] font-mono">
                1,420+
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
                Registered Users
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LIVE BIDDING SECTION: Responsive Grid                        */}
      {/* ============================================================ */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 pb-4 border-b-2 border-[#111111]">
          <div>
            <div className="flex items-center space-x-2 text-[#FF5A1F] text-xs font-bold uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
              <span>Real-Time Events</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#111111] tracking-tight">
              Live Bidding Events
            </h2>
          </div>
          <Link href="/bids" className="mt-4 sm:mt-0">
            <Button variant="outline" className="border-2 border-[#111111] text-[#111111] font-extrabold uppercase text-xs hover:bg-[#111111] hover:text-white">
              View All Live Bids ({liveItems.length})
            </Button>
          </Link>
        </div>

        {liveItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveItems.map((item) => (
              <BiddingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-[#E5E5E5] p-12 text-center">
            <Gavel className="h-12 w-12 text-[#686868] mx-auto mb-3" />
            <h3 className="text-lg font-bold uppercase">No active live events at this moment</h3>
            <p className="text-sm text-[#686868] mt-1">Check back shortly or explore our upcoming schedule.</p>
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS: 4-Step Editorial Process                       */}
      {/* ============================================================ */}
      <section className="bg-[#111111] text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              How ONEBID Works
            </h2>
            <p className="text-sm text-[#A0A0A0]">
              Win luxury gadgets and vehicles in four straightforward steps with full fairness and auditability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-[#1B1B1B] border-t-4 border-[#FF5A1F] p-6 space-y-4">
              <span className="text-4xl font-black text-[#FF5A1F] font-mono">01</span>
              <h3 className="text-lg font-black uppercase text-white">Register Free</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Sign up in seconds using your Ethiopian mobile number (+251). Your profile and wallet are generated instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1B1B1B] border-t-4 border-white p-6 space-y-4">
              <span className="text-4xl font-black text-white font-mono">02</span>
              <h3 className="text-lg font-black uppercase text-white">Top Up Wallet</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Transfer via telebirr, CBE Birr, or Awash Bank. Enter your transaction ID, and our administrator verifies your balance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1B1B1B] border-t-4 border-[#FF5A1F] p-6 space-y-4">
              <span className="text-4xl font-black text-[#FF5A1F] font-mono">03</span>
              <h3 className="text-lg font-black uppercase text-white">Place Your Bid</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Choose between Lowest-Unique-Bid competitions or Standard auctions. Submit your strategic secret or open bid.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#1B1B1B] border-t-4 border-white p-6 space-y-4">
              <span className="text-4xl font-black text-white font-mono">04</span>
              <h3 className="text-lg font-black uppercase text-white">Win & Claim</h3>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                When the countdown ends, the engine determines the winner. Collect your prize directly in Addis Ababa.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs tracking-wider px-6 py-5">
                Read Detailed Bidding Rules & Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CATEGORIES SECTION                                           */}
      {/* ============================================================ */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F]">
            Browse By Interest
          </span>
          <h2 className="text-3xl font-black uppercase text-[#111111]">
            Product Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/bids?category=${cat.slug}`}
                className="group bg-white border-2 border-[#E5E5E5] hover:border-[#FF5A1F] p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 bg-[#F5F5F3] group-hover:bg-[#FF5A1F] text-[#111111] group-hover:text-white transition-colors mb-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-sm uppercase text-[#111111] group-hover:text-[#FF5A1F] transition-colors">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-[#686868] uppercase font-semibold mt-1">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* UPCOMING & RECENT WINNERS SHOWCASE                           */}
      {/* ============================================================ */}
      {upcomingItems.length > 0 && (
        <section className="py-16 bg-white border-t border-[#E5E5E5]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10 pb-4 border-b-2 border-[#111111]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] block mb-1">
                  Coming Soon
                </span>
                <h2 className="text-3xl font-black uppercase text-[#111111]">
                  Upcoming Auctions
                </h2>
              </div>
              <Link href="/upcoming">
                <Button variant="outline" className="border-2 border-[#111111] font-bold uppercase text-xs">
                  View Full Schedule
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingItems.slice(0, 3).map((item) => (
                <BiddingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* REGISTRATION CALL TO ACTION SECTION                          */}
      {/* ============================================================ */}
      <section className="relative bg-[#FF5A1F] text-white py-16 overflow-hidden">
        <div className="absolute right-0 top-0 opacity-20 pointer-events-none">
          <HalftonePattern variant="corner" color="#111111" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 space-y-6 max-w-3xl">
          <span className="bg-[#111111] text-white text-xs font-black uppercase px-4 py-1.5 tracking-widest inline-block">
            Join 1,400+ Ethiopian Bidders
          </span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Ready To Start Bidding & Winning?
          </h2>
          <p className="text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            Create your account today, participate in daily demo events, and master the lowest unique bid strategy before national launch.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button className="bg-[#111111] hover:bg-black text-white font-black uppercase text-sm px-8 py-6 shadow-2xl">
                Create Free Account
              </Button>
            </Link>
            <Link href="/bids">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#FF5A1F] font-black uppercase text-sm px-8 py-6">
                Explore Auctions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
