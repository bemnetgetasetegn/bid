"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toaster";
import { formatPhone } from "@/lib/utils";
import { signUpAction } from "@/app/actions/auth.actions";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!acceptTerms) {
      setErrorMessage("You must accept the Terms & Conditions and Privacy Policy to register.");
      return;
    }

    const normalizedPhone = formatPhone(phone);
    if (!normalizedPhone.startsWith("+251") || normalizedPhone.length < 12) {
      setErrorMessage("Please enter a valid Ethiopian phone number (e.g. 0911234567 or +251911234567)");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUpAction({
        phone: normalizedPhone,
        password: password,
        fullName: fullName.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || "Registration failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to ONEBID, ${fullName}! Your wallet has been initialized.`,
        variant: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border-2 border-[#111111] p-8 shadow-2xl relative">
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF5A1F]" />

      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-black uppercase text-[#111111] tracking-tight">
          Create Account
        </h1>
        <p className="text-xs text-[#686868]">
          Join Ethiopia’s premier bidding marketplace in under a minute.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-[#DC2626]/10 border-l-4 border-[#DC2626] text-xs text-[#DC2626] flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullname" className="text-xs font-bold uppercase text-[#111111]">
            Full Name
          </Label>
          <Input
            id="fullname"
            type="text"
            placeholder="Abebe Kebede"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="text-sm font-semibold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-bold uppercase text-[#111111]">
            Ethiopian Phone Number
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
              className="pl-20 text-sm font-semibold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-11"
              required
            />
          </div>
          <span className="text-[10px] text-[#686868]">
            Accepted: 0911234567, 911234567, or +251911234567
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-bold uppercase text-[#111111]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-sm font-semibold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-11"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase text-[#111111]">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm font-semibold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-11"
            required
          />
        </div>

        {/* Terms Agreement Checkboxes */}
        <div className="pt-2 flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(!!checked)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs text-[#686868] leading-tight cursor-pointer font-normal">
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="font-bold text-[#111111] underline">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className="font-bold text-[#111111] underline">
              Privacy Policy
            </Link>{" "}
            of ONEBID Ethiopia.
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider py-6 shadow-md transition-colors mt-2"
        >
          {isLoading ? "Creating Account..." : "Register & Open Wallet"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-[#686868] border-t border-[#E5E5E5] pt-4">
        Already registered?{" "}
        <Link href="/login" className="font-black text-[#111111] uppercase hover:text-[#FF5A1F]">
          Sign In Here
        </Link>
      </div>
    </div>
  );
}
