"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      toast({
        title: "Message Dispatched",
        description: "Thank you for contacting ONEBID. We will respond within 2 hours.",
        variant: "success",
      });
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-[#FF5A1F] bg-[#111111] px-4 py-1 inline-block text-white">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
          Contact ONEBID Ethiopia
        </h1>
        <p className="text-sm text-[#686868] max-w-xl mx-auto">
          Need assistance with account verification, top-up confirmation, or prize collection? Our dedicated support team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Information Column */}
        <div className="md:col-span-5 bg-[#111111] text-white p-8 space-y-8 border-t-4 border-[#FF5A1F]">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Addis Ababa Head Office
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              ONEBID Ethiopia PLC operations and winner verification center.
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#CCCCCC]">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white uppercase text-xs">Address:</strong>
                <span>Namibia Street, Bole Sub-City, Addis Ababa, Ethiopia</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white uppercase text-xs">Telephone:</strong>
                <span>+251 91 123 4567 / +251 11 654 3210</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white uppercase text-xs">Email Inquiries:</strong>
                <span>support@onebid.et</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-[#FF5A1F] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white uppercase text-xs">Support Hours:</strong>
                <span>Monday – Sunday: 8:00 AM – 10:00 PM EAT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-7 bg-white border-2 border-[#111111] p-8 shadow-xl">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-[#16803C] mx-auto" />
              <h3 className="text-2xl font-black uppercase text-[#111111]">
                Message Received!
              </h3>
              <p className="text-sm text-[#686868] max-w-sm mx-auto">
                Our support desk has received your ticket and will reach out to you at your provided telephone number.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-[#111111] text-white uppercase font-bold text-xs"
              >
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-xs font-bold uppercase text-[#111111]">
                  Your Full Name
                </Label>
                <Input
                  id="fullname"
                  required
                  placeholder="e.g. Abebe Kebede"
                  className="bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase text-[#111111]">
                    Ethiopian Phone Number
                  </Label>
                  <Input
                    id="phone"
                    required
                    placeholder="+251 91 123 4567"
                    className="bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-bold uppercase text-[#111111]">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    required
                    placeholder="Top-up verification, Item pickup..."
                    className="bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs font-bold uppercase text-[#111111]">
                  Message Details
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Describe your inquiry or include relevant transaction ID references..."
                  className="bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F]"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-black uppercase text-xs tracking-wider py-6"
              >
                {isLoading ? "Submitting Inquiry..." : "Submit Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
