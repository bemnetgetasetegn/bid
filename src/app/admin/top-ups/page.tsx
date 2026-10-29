"use client";

import * as React from "react";
import { Wallet, Search, CheckCircle2, XCircle, AlertCircle, Clock, Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getTopUpRequests, approveTopUp, rejectTopUp, fallbackTopUps } from "@/lib/services/admin.service";
import { TopUpRequest } from "@/types";

export default function AdminTopUpsPage() {
  const [requests, setRequests] = React.useState<TopUpRequest[]>(fallbackTopUps);
  const [searchTxn, setSearchTxn] = React.useState("");
  const [selectedRequest, setSelectedRequest] = React.useState<TopUpRequest | null>(null);
  const [actionType, setActionType] = React.useState<"APPROVE" | "REJECT" | null>(null);
  const [note, setNote] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const data = await getTopUpRequests();
      setRequests(data);
    };
    load();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (!searchTxn) return true;
    return (
      r.transaction_id.toLowerCase().includes(searchTxn.toLowerCase()) ||
      r.user?.phone?.includes(searchTxn) ||
      r.user?.full_name?.toLowerCase().includes(searchTxn.toLowerCase())
    );
  });

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);

    try {
      const res = await approveTopUp(selectedRequest.id, note);
      if (res.success) {
        toast({
          title: "Top-Up Approved & Balance Credited",
          description: `Transaction ${selectedRequest.transaction_id} verified. Wallet credited atomically.`,
          variant: "success",
        });
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id ? { ...r, status: "APPROVED" } : r
          )
        );
        setSelectedRequest(null);
        setActionType(null);
        setNote("");
      } else {
        toast({
          title: "Approval Error",
          description: res.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);

    try {
      const res = await rejectTopUp(selectedRequest.id, note || "Invalid transaction ID");
      if (res.success) {
        toast({
          title: "Top-Up Request Rejected",
          description: `Transaction ${selectedRequest.transaction_id} rejected.`,
          variant: "destructive",
        });
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequest.id
              ? { ...r, status: "REJECTED", rejection_reason: note }
              : r
          )
        );
        setSelectedRequest(null);
        setActionType(null);
        setNote("");
      } else {
        toast({
          title: "Rejection Error",
          description: res.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Financial Verification
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Top-Up Requests
          </h1>
          <p className="text-xs text-[#686868] mt-1">
            Inspect transaction reference IDs and execute atomic wallet balance credits.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686868]" />
          <Input
            placeholder="Search Txn ID or Phone..."
            value={searchTxn}
            onChange={(e) => setSearchTxn(e.target.value)}
            className="pl-9 bg-white border-[#E5E5E5] text-xs font-semibold h-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">All ({filteredRequests.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredRequests.filter((r) => r.status === "PENDING_VERIFICATION").length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        {["all", "pending", "approved", "rejected"].map((tab) => {
          const list =
            tab === "all"
              ? filteredRequests
              : tab === "pending"
              ? filteredRequests.filter((r) => r.status === "PENDING_VERIFICATION")
              : tab === "approved"
              ? filteredRequests.filter((r) => r.status === "APPROVED")
              : filteredRequests.filter((r) => r.status === "REJECTED");

          return (
            <TabsContent key={tab} value={tab} className="pt-4">
              <div className="bg-white border-2 border-[#111111] shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#111111] text-white uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Provider</th>
                        <th className="p-3.5">Transaction ID</th>
                        <th className="p-3.5 text-right">Amount (ETB)</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5 text-center">Status</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {list.length > 0 ? (
                        list.map((req) => (
                          <tr key={req.id} className="hover:bg-[#F5F5F3] transition-colors">
                            <td className="p-3.5">
                              <span className="font-extrabold text-[#111111] block">
                                {req.user?.full_name || "User"}
                              </span>
                              <span className="text-[10px] text-[#686868] font-mono">
                                {req.user?.phone}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold uppercase text-[#111111]">
                              {req.payment_method}
                            </td>
                            <td className="p-3.5 font-mono font-black text-[#FF5A1F] text-xs">
                              {req.transaction_id}
                              {req.additional_information && (
                                <span className="block text-[10px] font-normal text-[#686868] truncate max-w-xs">
                                  {req.additional_information}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 font-mono font-black text-right text-sm">
                              {formatCurrency(req.amount)}
                            </td>
                            <td className="p-3.5 text-[#686868] text-[11px]">
                              {formatDate(req.created_at)}
                            </td>
                            <td className="p-3.5 text-center">
                              {req.status === "PENDING_VERIFICATION" && (
                                <Badge className="bg-[#D97706] text-white text-[9px] font-bold uppercase">
                                  PENDING
                                </Badge>
                              )}
                              {req.status === "APPROVED" && (
                                <Badge className="bg-[#16803C] text-white text-[9px] font-bold uppercase">
                                  APPROVED
                                </Badge>
                              )}
                              {req.status === "REJECTED" && (
                                <Badge className="bg-[#DC2626] text-white text-[9px] font-bold uppercase">
                                  REJECTED
                                </Badge>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              {req.status === "PENDING_VERIFICATION" ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setActionType("APPROVE");
                                    }}
                                    className="bg-[#16803C] hover:bg-green-700 text-white font-bold text-[10px] uppercase h-7 px-2.5"
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedRequest(req);
                                      setActionType("REJECT");
                                    }}
                                    className="border-red-600 text-red-600 hover:bg-red-50 font-bold text-[10px] uppercase h-7 px-2.5"
                                  >
                                    <X className="h-3 w-3 mr-1" /> Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-[#686868] font-semibold">
                                  Processed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-[#686868]">
                            No requests found matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Confirmation Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-4 border-[#111111] p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center space-x-2">
                {actionType === "APPROVE" ? (
                  <CheckCircle2 className="h-5 w-5 text-[#16803C]" />
                ) : (
                  <XCircle className="h-5 w-5 text-[#DC2626]" />
                )}
                <h3 className="font-black text-lg uppercase text-[#111111]">
                  {actionType === "APPROVE" ? "Confirm Top-Up Approval" : "Confirm Request Rejection"}
                </h3>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-[#686868] hover:text-[#111111]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-[#F5F5F3] p-4 text-xs space-y-2 border border-[#E5E5E5]">
              <div className="flex justify-between">
                <span className="text-[#686868]">Participant:</span>
                <span className="font-bold text-[#111111]">{selectedRequest.user?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Phone Number:</span>
                <span className="font-mono font-bold text-[#111111]">{selectedRequest.user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Transaction ID:</span>
                <span className="font-mono font-black text-[#FF5A1F]">{selectedRequest.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Credit Amount:</span>
                <span className="font-mono font-black text-[#16803C] text-sm">
                  {formatCurrency(selectedRequest.amount)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-[#111111]">
                Audit Note / Verification Reason
              </label>
              <Input
                placeholder={
                  actionType === "APPROVE"
                    ? "Verified against bank statement"
                    : "e.g. Transaction ID not found in telebirr account"
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-[#F5F5F3] text-xs"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedRequest(null)}
                className="flex-1 uppercase font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={actionType === "APPROVE" ? handleApprove : handleReject}
                disabled={isProcessing}
                className={`flex-1 font-extrabold uppercase text-xs text-white ${
                  actionType === "APPROVE"
                    ? "bg-[#16803C] hover:bg-green-700"
                    : "bg-[#DC2626] hover:bg-red-700"
                }`}
              >
                {isProcessing ? "Processing..." : `Confirm ${actionType}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
