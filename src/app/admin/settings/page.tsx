"use client";

import * as React from "react";
import { Sliders, ShieldAlert, Lock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = React.useState("ONEBID");
  const [currency, setCurrency] = React.useState("ETB");
  const [demoMode, setDemoMode] = React.useState(true);
  const [realMoneyBidding, setRealMoneyBidding] = React.useState(false);
  const [settlementEnabled, setSettlementEnabled] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "System Configuration Saved",
      description: "Platform settings updated in secure store.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Platform Governance
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          System Settings & Feature Flags
        </h1>
      </div>

      {/* Critical Legal Warning Banner */}
      <div className="bg-[#111111] text-white p-6 border-l-4 border-[#FF5A1F] space-y-2 shadow-lg">
        <div className="flex items-center space-x-2 text-[#FF5A1F]">
          <ShieldAlert className="h-5 w-5" />
          <h3 className="font-black text-sm uppercase tracking-wider">
            Mandatory Financial Safeguard Policy
          </h3>
        </div>
        <p className="text-xs text-[#A0A0A0] leading-relaxed">
          In strict compliance with Ethiopian national commerce and consumer protection standards, real-money transactions and automated settlement are locked behind server-side feature flags. Enabling these options requires explicit regulatory authorization from Ethiopian trade and lottery authorities.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border-2 border-[#111111] p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Platform Brand Name
            </Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="bg-[#F5F5F3] font-bold text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Base Currency Code
            </Label>
            <Input
              value={currency}
              disabled
              className="bg-[#E5E5E5] font-mono text-sm cursor-not-allowed"
            />
          </div>
        </div>

        {/* Feature Flags Section */}
        <div className="pt-4 border-t border-[#E5E5E5] space-y-4">
          <h3 className="font-black text-sm uppercase text-[#111111]">
            Operating Modes & Regulatory Gates
          </h3>

          {/* Demo Mode */}
          <div className="flex items-center justify-between p-4 bg-[#F5F5F3] border border-[#E5E5E5]">
            <div className="space-y-0.5">
              <span className="font-extrabold text-xs uppercase text-[#111111] block">
                Demonstration & Pilot Mode
              </span>
              <p className="text-[11px] text-[#686868]">
                Enforces simulated wallet tokens and displays public test notices.
              </p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </div>

          {/* Real Money Bidding Gate */}
          <div className="flex items-center justify-between p-4 bg-[#F5F5F3] border border-[#E5E5E5] opacity-75">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs uppercase text-[#111111]">
                  Live Real-Money Bidding
                </span>
                <Badge variant="outline" className="border-[#DC2626] text-[#DC2626] text-[9px] font-bold">
                  LOCKED
                </Badge>
              </div>
              <p className="text-[11px] text-[#686868]">
                Requires legal authorization certificate and telebirr merchant KYC.
              </p>
            </div>
            <Switch
              checked={realMoneyBidding}
              onCheckedChange={(val) => {
                if (val) {
                  toast({
                    title: "Action Restricted",
                    description: "Cannot enable real-money bidding without uploaded license verification.",
                    variant: "destructive",
                  });
                }
              }}
              disabled
            />
          </div>

          {/* Direct Settlement Gate */}
          <div className="flex items-center justify-between p-4 bg-[#F5F5F3] border border-[#E5E5E5] opacity-75">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs uppercase text-[#111111]">
                  Automated Bank Settlement Engine
                </span>
                <Badge variant="outline" className="border-[#DC2626] text-[#DC2626] text-[9px] font-bold">
                  LOCKED
                </Badge>
              </div>
              <p className="text-[11px] text-[#686868]">
                Requires National Bank of Ethiopia direct gateway protocol integration.
              </p>
            </div>
            <Switch checked={settlementEnabled} disabled />
          </div>
        </div>

        <Button
          type="submit"
          className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-extrabold uppercase text-xs px-8 py-5"
        >
          Save Configuration
        </Button>
      </form>
    </div>
  );
}
