export const metadata = {
  title: "Terms and Conditions — ONEBID Ethiopia",
  description: "Official terms and conditions governing participation on the ONEBID bidding marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="border-b-2 border-[#111111] pb-6">
        <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
          Legal Agreement
        </span>
        <h1 className="text-4xl font-black uppercase text-[#111111]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#686868] mt-1">
          Last Updated: October 2026 • ONEBID Ethiopia PLC
        </p>
      </div>

      <div className="bg-white border-2 border-[#E5E5E5] p-8 space-y-6 text-sm text-[#444444] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            1. Acceptance of Terms
          </h2>
          <p>
            By creating an account, accessing, or placing bids on ONEBID (accessible via onebid.et and affiliated services), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            2. Eligibility & Phone Authentication
          </h2>
          <p>
            Participants must be at least 18 years of age and hold a registered Ethiopian mobile telephone number (+251). Each individual is limited to exactly one personal account. Duplicate registrations with multiple SIM cards or automated bot networks are strictly prohibited and will result in immediate disqualification and forfeiture of balances.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            3. Demonstration Mode & Simulated Balances
          </h2>
          <p>
            The platform is currently operating in Demonstration Mode while licensing and regulatory clearances are being completed. In demo mode, all financial entries and wallet balances represent test simulations for training and evaluation. No real currency will be demanded or paid out until formal commercial release is authorized.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            4. Bidding Rules and Arbitration
          </h2>
          <p>
            Every auction is governed strictly by its published rules:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Lowest Unique Bid:</strong> The winner is determined as the lowest bid amount that is completely unique (submitted by exactly one participant).
            </li>
            <li>
              <strong>Standard Highest Bid:</strong> The winner is the participant holding the highest bid when the clock reaches 00:00:00.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-black uppercase text-[#111111]">
            5. Wallet Top-Up and Manual Verification
          </h2>
          <p>
            Users requesting wallet top-ups must submit valid transaction identifiers from authorized providers (telebirr, CBE Birr, Awash Bank). Entering fraudulent or fabricated transaction numbers constitutes an offense and results in immediate account suspension.
          </p>
        </section>
      </div>
    </div>
  );
}
