


"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from "@/features/shared/notificationSlice";

export default function NotificationPage({ recipientId }) {
  const dispatch = useDispatch();
  const { items: notifications = [], status } = useSelector(
    (state) => state.notifications || {}
  );

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (recipientId) {
      dispatch(fetchNotifications(recipientId));
    }
  }, [dispatch, recipientId]);

  const handleSelect = (notif) => {
    setSelected(notif);
    if (!notif.read) {
      dispatch(markAsRead(notif._id));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
    if (selected?._id === id) setSelected(null);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-[320px] bg-white border-r shadow-sm overflow-y-auto">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
            {notifications.filter((n) => !n.read).length} unread
          </span>
        </div>

        {status === "loading" ? (
          <div className="p-6 text-center text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No notifications.
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                onClick={() => handleSelect(notif)}
                className={cn(
                  "cursor-pointer px-4 py-3 transition hover:bg-gray-100",
                  !notif.read ? "bg-indigo-50" : "",
                  selected?._id === notif._id && "bg-indigo-100"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2 leading-snug">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(notif.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-rose-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Detail Panel */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {selected ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Notification Details</h3>
              <div className="flex gap-2">
                {!selected.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch(markAsRead(selected._id))}
                    className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selected._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Received: {formatTimestamp(selected.createdAt)}
            </div>
            <div className="bg-white p-4 border rounded shadow-sm text-base whitespace-pre-line">
              {selected.message}
            </div>
            {selected.link && (
              <a
                href={selected.link}
                className="text-blue-600 hover:underline text-sm inline-block"
              >
                View Related Item →
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a notification to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}











