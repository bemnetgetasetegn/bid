"use client";

import * as React from "react";
import Link from "next/link";
import { Phone, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Recovery Instructions Sent",
      description: "If an account matches this phone number, an SMS verification code has been dispatched.",
      variant: "success",
    });
  };

  return (
    <div className="w-full max-w-md bg-white border-2 border-[#111111] p-8 shadow-2xl relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF5A1F]" />

      <div className="mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#686868] hover:text-[#FF5A1F]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sign In
        </Link>
      </div>

      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-black uppercase text-[#111111] tracking-tight">
          Account Recovery
        </h1>
        <p className="text-xs text-[#686868]">
          Reset your password via verified Ethiopian SMS OTP.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#F5F5F3] p-6 text-center space-y-4 border border-[#E5E5E5]">
          <CheckCircle2 className="h-12 w-12 text-[#16803C] mx-auto" />
          <h3 className="font-black text-sm uppercase text-[#111111]">
            SMS Verification Sent
          </h3>
          <p className="text-xs text-[#686868] leading-relaxed">
            Please enter the 6-digit code sent to your phone. If you need manual customer service recovery, contact our helpdesk at <strong>+251 91 123 4567</strong>.
          </p>
          <Link href="/login" className="block pt-2">
            <Button className="w-full bg-[#111111] text-white uppercase font-bold text-xs">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-bold uppercase text-[#111111]">
              Registered Phone Number
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-[#686868]">
                🇪🇹 +251
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="91 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-20 text-sm font-semibold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-12"
                required
              />
            </div>
          </div>

          <div className="bg-[#F5F5F3] p-3 text-xs text-[#686868] border border-[#E5E5E5] flex items-start space-x-2">
            <ShieldAlert className="h-4 w-4 text-[#FF5A1F] shrink-0 mt-0.5" />
            <span>
              For your security, password resets require SMS confirmation or identity verification with our Addis Ababa office.
            </span>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider py-6"
          >
            Send Verification Code
          </Button>
        </form>
      )}
    </div>
  );
}
