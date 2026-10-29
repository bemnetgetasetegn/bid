"use client";

import * as React from "react";
import { HelpCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = React.useState([
    {
      id: "1",
      question: "What is ONEBID and how does it work?",
      answer: "ONEBID is Ethiopia's premier gamified bidding platform.",
    },
    {
      id: "2",
      question: "What is a Lowest Unique Bid competition?",
      answer: "The winner is the lowest bid submitted by exactly one participant.",
    },
    {
      id: "3",
      question: "How do I deposit funds into my ONEBID wallet?",
      answer: "Transfer via telebirr or CBE Birr and submit your Transaction Reference ID.",
    }
  ]);

  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) return;
    setFaqs([...faqs, { id: String(Date.now()), question, answer }]);
    setQuestion("");
    setAnswer("");
    toast({
      title: "FAQ Published",
      description: "Question and answer added to help center.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Manage FAQs
        </h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white border-2 border-[#111111] p-6 shadow-sm space-y-4">
        <h3 className="font-black text-sm uppercase text-[#111111]">
          Add New FAQ Item
        </h3>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase text-[#111111]">Question</Label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Can I withdraw my balance?"
            className="bg-[#F5F5F3] text-xs"
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase text-[#111111]">Answer</Label>
          <Textarea
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Detailed answer..."
            className="bg-[#F5F5F3] text-xs"
            required
          />
        </div>
        <Button type="submit" className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs">
          <Plus className="h-4 w-4 mr-1" /> Publish FAQ
        </Button>
      </form>

      <div className="bg-white border-2 border-[#111111] shadow-md divide-y divide-[#E5E5E5]">
        {faqs.map((f) => (
          <div key={f.id} className="p-4 space-y-1">
            <h4 className="font-extrabold text-sm text-[#111111]">{f.question}</h4>
            <p className="text-xs text-[#686868]">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
