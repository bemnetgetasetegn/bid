"use client";

import * as React from "react";
import { FileText, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";

export default function AdminContentPage() {
  const [headline, setHeadline] = React.useState("Your Next Big Win Starts With One Bid.");
  const [subheading, setSubheading] = React.useState(
    "Discover exciting bidding opportunities on technology, electronics, lifestyle products, and more."
  );
  const [paymentTelebirr, setPaymentTelebirr] = React.useState(
    "Transfer to telebirr merchant code 882011 or phone 0911234567. Include your ONEBID account phone as the transaction reference."
  );
  const [paymentCBE, setPaymentCBE] = React.useState(
    "Transfer to CBE Birr account 100023456789. Enter transaction ID after sending."
  );
  const [supportPhone, setSupportPhone] = React.useState("+251 91 123 4567");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Content Settings Updated",
      description: "Homepage copy and payment instructions saved.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Website Content Management
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Content & Copy Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white border-2 border-[#111111] p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-[#111111]">
            Homepage Hero Headline
          </Label>
          <Input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="bg-[#F5F5F3] font-black text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-[#111111]">
            Homepage Hero Subheading
          </Label>
          <Textarea
            rows={2}
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            className="bg-[#F5F5F3] text-xs"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-[#111111]">
            telebirr Payment Instructions
          </Label>
          <Textarea
            rows={2}
            value={paymentTelebirr}
            onChange={(e) => setPaymentTelebirr(e.target.value)}
            className="bg-[#F5F5F3] text-xs font-mono"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-[#111111]">
            CBE Birr Payment Instructions
          </Label>
          <Textarea
            rows={2}
            value={paymentCBE}
            onChange={(e) => setPaymentCBE(e.target.value)}
            className="bg-[#F5F5F3] text-xs font-mono"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase text-[#111111]">
            Customer Support Phone
          </Label>
          <Input
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            className="bg-[#F5F5F3] font-mono text-xs"
            required
          />
        </div>

        <Button
          type="submit"
          className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs px-8 py-5"
        >
          <Save className="h-4 w-4 mr-1.5" /> Save Changes
        </Button>
      </form>
    </div>
  );
}
