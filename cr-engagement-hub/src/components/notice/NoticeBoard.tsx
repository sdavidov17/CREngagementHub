"use client";

import React, { useState } from "react";
import { Notice } from "@/types/notice";
import { formatDistanceToNow } from "date-fns";
import { Card, Badge } from "@/components/ui";

interface NoticeBoardProps {
  notices: Notice[];
  onMarkAsRead?: (noticeId: string) => void;
}

export function NoticeBoard({ notices, onMarkAsRead }: NoticeBoardProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotices = notices.filter(
    (notice) =>
      filter === "all" ||
      (filter === "unread" && !notice.readBy.includes("current-user-id"))
  );

  const sortedNotices = [...filteredNotices].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  const getPriorityColor = (priority: Notice["priority"]) => {
    switch (priority) {
      case "high":
        return "text-danger bg-danger/10 border-danger/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "low":
        return "text-teal bg-teal/10 border-teal/20";
      default:
        return "text-light-gray bg-light-gray/10 border-light-gray/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h2 font-bold text-white">Notice Board</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "all"
                ? "bg-teal/20 text-teal"
                : "text-light-gray hover:bg-dark-gray"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === "unread"
                ? "bg-teal/20 text-teal"
                : "text-light-gray hover:bg-dark-gray"
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedNotices.length > 0 ? (
          sortedNotices.map((notice) => {
            const isUnread = !notice.readBy.includes("current-user-id");

            return (
              <Card
                key={notice.id}
                className={`relative ${isUnread ? "ring-1 ring-teal" : ""}`}
              >
                {isUnread && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-teal"></div>
                )}

                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {notice.title}
                  </h3>
                  <Badge className={getPriorityColor(notice.priority)}>
                    {notice.priority.charAt(0).toUpperCase() +
                      notice.priority.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-light-gray mb-2">
                  Posted:{" "}
                  {formatDistanceToNow(new Date(notice.publishedDate), {
                    addSuffix: true,
                  })}
                  {notice.expiryDate && (
                    <>
                      {" "}
                      • Expires:{" "}
                      {formatDistanceToNow(new Date(notice.expiryDate), {
                        addSuffix: true,
                      })}
                    </>
                  )}
                </p>

                <div className="mb-4 text-white space-y-2">
                  {notice.content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {notice.link && (
                  <a
                    href={notice.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline text-sm inline-block mb-2"
                  >
                    Learn more
                  </a>
                )}

                {isUnread && onMarkAsRead && (
                  <button
                    onClick={() => onMarkAsRead(notice.id)}
                    className="text-sm text-light-gray hover:text-white hover:underline mt-2"
                  >
                    Mark as read
                  </button>
                )}

                <div className="mt-2 text-xs text-light-gray">
                  {notice.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 mr-2 rounded-full bg-dark-gray"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-10 text-center text-light-gray">
            {filter === "unread"
              ? 'No unread notices. Check the "All" tab to see previous notices.'
              : "No notices available at this time."}
          </div>
        )}
      </div>
    </div>
  );
}
