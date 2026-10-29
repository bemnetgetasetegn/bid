"use client";

import * as React from "react";
import { User, Phone, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [fullName, setFullName] = React.useState("Abebe Kebede");
  const [phone, setPhone] = React.useState("+251 91 123 4567");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (user.user_metadata?.full_name) setFullName(user.user_metadata.full_name);
          if (user.phone) setPhone(user.phone);
        }
      } catch {
        // demo fallback
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your display details have been updated successfully.",
        variant: "success",
      });
    }, 600);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast({
        title: "Password Changed",
        description: "Your security credentials have been successfully updated.",
        variant: "success",
      });
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Account Management
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Profile Settings
        </h1>
      </div>

      {/* Account Info Box */}
      <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-[#111111] text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase text-[#111111]">
                Identity & Contact
              </h3>
              <span className="text-xs text-[#686868]">
                Verified Ethiopian Phone Profile
              </span>
            </div>
          </div>
          <Badge className="bg-[#16803C] text-white font-bold text-xs uppercase px-3 py-1">
            ACTIVE & VERIFIED
          </Badge>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Full Name
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#F5F5F3] font-semibold text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Phone Number (Primary Login)
              </Label>
              <Input
                value={phone}
                disabled
                className="bg-[#E5E5E5] font-mono text-sm text-[#686868] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#686868]">
                Phone cannot be changed directly without support authorization.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-bold uppercase text-xs px-6"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* Password Change Box */}
      <div className="bg-white border-2 border-[#111111] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5E5E5]">
          <div className="p-3 bg-[#FF5A1F] text-white">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase text-[#111111]">
              Change Password
            </h3>
            <span className="text-xs text-[#686868]">
              Ensure your account uses a robust combination of characters
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Current Password
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-[#F5F5F3]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                New Password
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#F5F5F3]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Confirm New Password
              </Label>
              <Input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="bg-[#F5F5F3]"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isUpdatingPassword}
              className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs px-6"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
