"use client";

import * as React from "react";
import { ShieldAlert, Search, Filter, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [search, setSearch] = React.useState("");

  const logs = [
    {
      id: "log-101",
      actor: "Primary Administrator (+251911999999)",
      action: "APPROVE_TOP_UP",
      entity_type: "top_up_request",
      entity_id: "req-004",
      details: "Approved telebirr top-up TBR88392011 for 500.00 ETB. Wallet balance credited atomically.",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "log-102",
      actor: "Primary Administrator (+251911999999)",
      action: "FINALIZE_EVENT",
      entity_type: "bidding_item",
      entity_id: "b1000000-0000-0000-0000-000000000006",
      details: "Executed Lowest Unique Bid arbitration. Winner determined: Kidus M. (12.40 ETB).",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "log-103",
      actor: "Primary Administrator (+251911999999)",
      action: "SUSPEND_USER",
      entity_type: "profile",
      entity_id: "u-104",
      details: "Suspended account +251944667788 due to invalid transaction ID submission.",
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "log-104",
      actor: "System Initializer",
      action: "PROVISION_ADMIN",
      entity_type: "profile",
      entity_id: "admin-root",
      details: "Initial administrator account provisioned via server-side secure script.",
      created_at: new Date(Date.now() - 604800000).toISOString(),
    }
  ];

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Immutable Audit Trail
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Security Audit Logs
          </h1>
          <p className="text-xs text-[#686868] mt-1">
            Cryptographically recorded log of privileged administrative operations and financial actions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686868]" />
          <Input
            placeholder="Search action, actor, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-[#E5E5E5] text-xs font-semibold h-10"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md divide-y divide-[#E5E5E5]">
        {filtered.map((log) => (
          <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#111111] text-white font-mono text-[9px] uppercase font-bold">
                  {log.action}
                </Badge>
                <span className="font-bold text-[#111111]">{log.actor}</span>
              </div>
              <p className="text-[#555555] leading-relaxed">
                {log.details}
              </p>
            </div>
            <div className="shrink-0 text-right font-mono text-[11px] text-[#686868]">
              {formatDate(log.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
