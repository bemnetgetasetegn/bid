import { describe, it, expect } from "vitest";

// Pure business logic implementation for Lowest Unique Bid and Highest Bid determination
export interface BidRecord {
  id: string;
  user_id: string;
  amount: number; // minor units
  created_at: number;
}

export function determineLowestUniqueBidWinner(bids: BidRecord[]): BidRecord | null {
  if (bids.length === 0) return null;

  // 1. Group bids by amount to count frequency
  const countMap = new Map<number, number>();
  for (const bid of bids) {
    countMap.set(bid.amount, (countMap.get(bid.amount) || 0) + 1);
  }

  // 2. Filter only unique bids (count === 1)
  const uniqueAmounts = new Set<number>();
  for (const [amount, count] of countMap.entries()) {
    if (count === 1) {
      uniqueAmounts.add(amount);
    }
  }

  if (uniqueAmounts.size === 0) {
    return null; // No unique bid exists
  }

  // 3. Find the lowest among unique amounts
  const uniqueBids = bids.filter((b) => uniqueAmounts.has(b.amount));
  uniqueBids.sort((a, b) => a.amount - b.amount || a.created_at - b.created_at);

  return uniqueBids[0];
}

export function determineHighestBidWinner(bids: BidRecord[]): BidRecord | null {
  if (bids.length === 0) return null;

  // Highest amount wins; if tied, earliest timestamp wins
  const sorted = [...bids].sort(
    (a, b) => b.amount - a.amount || a.created_at - b.created_at
  );

  return sorted[0];
}

describe("Bidding Engine Arbitration Algorithms", () => {
  describe("Lowest Unique Bid Competition", () => {
    it("determines the lowest unique bid correctly when collisions exist", () => {
      const bids: BidRecord[] = [
        { id: "b1", user_id: "u1", amount: 100, created_at: 1 }, // 1.00 ETB
        { id: "b2", user_id: "u2", amount: 100, created_at: 2 }, // 1.00 ETB (collision -> eliminated!)
        { id: "b3", user_id: "u3", amount: 150, created_at: 3 }, // 1.50 ETB (unique!)
        { id: "b4", user_id: "u4", amount: 200, created_at: 4 }, // 2.00 ETB (unique, but 150 is lower)
      ];

      const winner = determineLowestUniqueBidWinner(bids);
      expect(winner).not.toBeNull();
      expect(winner?.id).toBe("b3");
      expect(winner?.amount).toBe(150);
      expect(winner?.user_id).toBe("u3");
    });

    it("returns null if all submitted bids have collisions (no unique bid exists)", () => {
      const bids: BidRecord[] = [
        { id: "b1", user_id: "u1", amount: 100, created_at: 1 },
        { id: "b2", user_id: "u2", amount: 100, created_at: 2 },
        { id: "b3", user_id: "u3", amount: 250, created_at: 3 },
        { id: "b4", user_id: "u4", amount: 250, created_at: 4 },
      ];

      const winner = determineLowestUniqueBidWinner(bids);
      expect(winner).toBeNull();
    });

    it("handles single participant bid correctly", () => {
      const bids: BidRecord[] = [
        { id: "b1", user_id: "u1", amount: 350, created_at: 1 },
      ];

      const winner = determineLowestUniqueBidWinner(bids);
      expect(winner?.id).toBe("b1");
    });
  });

  describe("Highest Bid Auction", () => {
    it("determines the highest eligible bid as the winner", () => {
      const bids: BidRecord[] = [
        { id: "b1", user_id: "u1", amount: 50000, created_at: 1 },
        { id: "b2", user_id: "u2", amount: 85000, created_at: 2 },
        { id: "b3", user_id: "u3", amount: 70000, created_at: 3 },
      ];

      const winner = determineHighestBidWinner(bids);
      expect(winner?.id).toBe("b2");
      expect(winner?.amount).toBe(85000);
    });

    it("breaks ties using earliest timestamp", () => {
      const bids: BidRecord[] = [
        { id: "b1", user_id: "u1", amount: 100000, created_at: 100 },
        { id: "b2", user_id: "u2", amount: 100000, created_at: 200 },
      ];

      const winner = determineHighestBidWinner(bids);
      expect(winner?.id).toBe("b1"); // Earliest submission wins
    });
  });
});
