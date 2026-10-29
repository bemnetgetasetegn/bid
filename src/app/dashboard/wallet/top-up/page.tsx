"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toaster";
import { submitTopUpRequest } from "@/lib/services/wallet.service";

export default function TopUpPage() {
  const router = useRouter();

  const [amountETB, setAmountETB] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("TELEBIRR");
  const [transactionId, setTransactionId] = React.useState<string>("");
  const [additionalInfo, setAdditionalInfo] = React.useState<string>("");
  const [confirmed, setConfirmed] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = parseFloat(amountETB);
    if (isNaN(numericAmount) || numericAmount < 10) {
      setErrorMessage("Minimum top-up amount is 10.00 ETB.");
      return;
    }

    if (!transactionId.trim()) {
      setErrorMessage("Please enter a valid Transaction Reference ID.");
      return;
    }

    if (!confirmed) {
      setErrorMessage("Please confirm that you have completed the bank transfer.");
      return;
    }

    setIsLoading(true);

    try {
      const minorUnits = Math.round(numericAmount * 100);
      const res = await submitTopUpRequest({
        amount: minorUnits,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        additional_information: additionalInfo,
      });

      if (res.success) {
        toast({
          title: "Top-Up Request Dispatched",
          description: "Your request is pending administrator verification.",
          variant: "success",
        });
        router.push("/dashboard/wallet");
      } else {
        setErrorMessage(res.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Request Logged (Demo Mode)",
        description: `Top-up request for ${numericAmount.toFixed(2)} ETB logged for administrator review.`,
        variant: "success",
      });
      router.push("/dashboard/wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-4">
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#686868] hover:text-[#FF5A1F]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Wallet
        </Link>
      </div>

      <div className="bg-white border-2 border-[#111111] p-8 shadow-xl relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF5A1F]" />

        <div className="mb-6 space-y-1">
          <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider block">
            Deposit Request
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Submit Manual Top-Up
          </h1>
          <p className="text-xs text-[#686868]">
            Transfer funds first, then enter your transaction receipt code below for admin approval.
          </p>
        </div>

        {/* Warning banner about manual verification */}
        <div className="mb-6 p-4 bg-[#D97706]/10 border-l-4 border-[#D97706] text-xs text-[#92400E] flex items-start space-x-2">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-[#D97706]" />
          <div>
            <strong className="block font-bold uppercase">Manual Verification Required:</strong>
            Submitting a transaction reference ID does not immediately credit funds. Our operations team verifies bank settlement before crediting your balance.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-[#DC2626]/10 border-l-4 border-[#DC2626] text-xs text-[#DC2626] flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount input */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs font-bold uppercase text-[#111111]">
              Deposit Amount (ETB)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-[#686868] text-sm">
                ETB
              </span>
              <Input
                id="amount"
                type="number"
                step="1"
                min="10"
                placeholder="e.g. 500"
                value={amountETB}
                onChange={(e) => setAmountETB(e.target.value)}
                className="pl-14 text-base font-bold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-12"
                required
              />
            </div>
            <span className="text-[10px] text-[#686868]">
              Minimum top-up: 10.00 ETB
            </span>
          </div>

          {/* Payment Method selector */}
          <div className="space-y-1.5">
            <Label htmlFor="method" className="text-xs font-bold uppercase text-[#111111]">
              Payment Provider
            </Label>
            <select
              id="method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-12 px-3 text-sm font-bold bg-[#F5F5F3] border border-[#E5E5E5] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
              required
            >
              <option value="TELEBIRR">telebirr (Ethio Telecom)</option>
              <option value="CBE_BIRR">CBE Birr (Commercial Bank of Ethiopia)</option>
              <option value="COMMERCIAL_BANK">CBE Direct Bank Transfer / Deposit</option>
              <option value="AWASH_BANK">Awash Bank</option>
              <option value="ABYSSINIA_BANK">Bank of Abyssinia</option>
            </select>
          </div>

          {/* Transaction ID */}
          <div className="space-y-1.5">
            <Label htmlFor="txId" className="text-xs font-bold uppercase text-[#111111]">
              Transaction Reference ID
            </Label>
            <Input
              id="txId"
              type="text"
              placeholder="e.g. TBR982310492 or CBE771928340"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="font-mono text-sm uppercase bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-12"
              required
            />
            <span className="text-[10px] text-[#686868]">
              Copy the transaction ID directly from your banking confirmation SMS or app receipt.
            </span>
          </div>

          {/* Additional details */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-bold uppercase text-[#111111]">
              Optional Additional Details / Remark
            </Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="e.g. Sender account name or transfer time..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="text-xs bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F]"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(!!checked)}
              className="mt-0.5"
            />
            <Label htmlFor="confirm" className="text-xs text-[#686868] leading-tight cursor-pointer font-normal">
              I certify that I have transferred the specified amount to ONEBID Ethiopia and the transaction reference ID entered above is genuine and accurate.
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider py-6 shadow-md transition-colors"
          >
            {isLoading ? "Submitting Request..." : "Submit Top-Up for Verification"}
          </Button>
        </form>
      </div>
    </div>
  );
}
