"use client";

import * as React from "react";
import { Bell, CheckCheck, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getUserNotifications, markNotificationAsRead } from "@/lib/services/notifications.service";
import { Notification } from "@/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      const data = await getUserNotifications();
      setNotifications(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex justify-between items-end">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Activity Updates
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Notifications
          </h1>
        </div>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md divide-y divide-[#E5E5E5]">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !n.is_read ? "bg-[#FF5A1F]/5 border-l-4 border-[#FF5A1F]" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm uppercase text-[#111111]">
                    {n.title}
                  </span>
                  {!n.is_read && (
                    <Badge className="bg-[#FF5A1F] text-white text-[9px] uppercase font-bold py-0">
                      NEW
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#555555] leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-[#888888] font-mono block">
                  {formatDate(n.created_at)}
                </span>
              </div>

              {!n.is_read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMarkAsRead(n.id)}
                  className="border-[#111111] text-[10px] uppercase font-bold self-start sm:self-center"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" /> Mark Read
                </Button>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-[#686868]">
            No notifications recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
