export const metadata = {
  title: "Privacy Policy — ONEBID Ethiopia",
  description: "How ONEBID collects, stores, and protects participant personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="border-b-2 border-[#111111] pb-6">
        <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
          Data Governance
        </span>
        <h1 className="text-4xl font-black uppercase text-[#111111]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#686868] mt-1">
          Effective: October 2026 • Compliant with Ethiopian Data Protection Standards
        </p>
      </div>

      <div className="bg-white border-2 border-[#E5E5E5] p-8 space-y-6 text-sm text-[#444444] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            1. Information We Collect
          </h2>
          <p>
            We collect the minimum information required to operate a secure bidding environment:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Data:</strong> Full Name and Ethiopian Phone Number (+251).</li>
            <li><strong>Transactional Data:</strong> Payment provider references, transaction IDs, bid history, and wallet ledgers.</li>
            <li><strong>Technical Telemetry:</strong> Device identifiers and IP logs strictly for anti-fraud analysis.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            2. Confidentiality of Bids
          </h2>
          <p>
            In Lowest Unique Bid events, your submitted bid amounts are encrypted and hidden from other participants and the public interface. They are revealed only during post-event audits or in winner announcements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            3. Data Sharing & Third Parties
          </h2>
          <p>
            We do not sell, rent, or trade participant information. Data may be shared only with licensed Ethiopian payment partners (Ethio Telecom / telebirr, commercial banks) for transaction verification and dispute settlement.
          </p>
        </section>
      </div>
    </div>
  );
}
