"use client";

import React, { useState } from "react";
import { RagStatus } from "@/types/rag";
import { Card, Badge, Button } from "@/components/ui";
import { format } from "date-fns";

interface StatusTrackerProps {
  statuses: RagStatus[];
  onUpdateStatus?: (
    statusId: string,
    newStatus: "red" | "amber" | "green"
  ) => void;
  onAddComment?: (statusId: string, comment: string) => void;
}

export function StatusTracker({
  statuses,
  onUpdateStatus,
  onAddComment,
}: StatusTrackerProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "red" | "amber" | "green"
  >("all");
  const [commentText, setCommentText] = useState<string>("");
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const filteredStatuses = statuses.filter(
    (status) => activeFilter === "all" || status.currentStatus === activeFilter
  );

  const sortedStatuses = [...filteredStatuses].sort((a, b) => {
    if (a.priority !== b.priority) {
      // Sort by priority first (High > Medium > Low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Then sort by status (Red > Amber > Green)
    const statusOrder = { red: 0, amber: 1, green: 2 };
    return statusOrder[a.currentStatus] - statusOrder[b.currentStatus];
  });

  const getStatusColor = (status: "red" | "amber" | "green") => {
    switch (status) {
      case "red":
        return "text-white bg-danger";
      case "amber":
        return "text-black bg-warning";
      case "green":
        return "text-white bg-success";
      default:
        return "text-light-gray bg-light-gray/10";
    }
  };

  const handleCommentSubmit = (statusId: string) => {
    if (commentText.trim() && onAddComment) {
      onAddComment(statusId, commentText);
      setCommentText("");
      setActiveCommentId(null);
    }
  };

  const counts = {
    total: statuses.length,
    red: statuses.filter((s) => s.currentStatus === "red").length,
    amber: statuses.filter((s) => s.currentStatus === "amber").length,
    green: statuses.filter((s) => s.currentStatus === "green").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-bold text-white mb-4">
          RAG Status Tracker
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === "all"
                  ? "bg-teal/20 text-teal"
                  : "text-light-gray hover:bg-dark-gray"
              }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setActiveFilter("red")}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === "red"
                  ? "bg-danger/20 text-danger"
                  : "text-light-gray hover:bg-dark-gray"
              }`}
            >
              Red ({counts.red})
            </button>
            <button
              onClick={() => setActiveFilter("amber")}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === "amber"
                  ? "bg-amber-500/20 text-amber-500"
                  : "text-light-gray hover:bg-dark-gray"
              }`}
            >
              Amber ({counts.amber})
            </button>
            <button
              onClick={() => setActiveFilter("green")}
              className={`px-3 py-1 rounded-md text-sm ${
                activeFilter === "green"
                  ? "bg-teal/20 text-teal"
                  : "text-light-gray hover:bg-dark-gray"
              }`}
            >
              Green ({counts.green})
            </button>
          </div>
        </div>
      </div>

      {sortedStatuses.length > 0 ? (
        <div className="space-y-4">
          {sortedStatuses.map((status) => (
            <Card key={status.id} className="overflow-visible">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {status.title}
                  </h3>
                  <p className="text-sm text-light-gray">
                    {status.description}
                  </p>
                </div>
                <Badge className={getStatusColor(status.currentStatus)}>
                  {status.currentStatus.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-light-gray mb-1">
                    Category
                  </h4>
                  <p className="text-white">{status.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-light-gray mb-1">
                    Owner
                  </h4>
                  <p className="text-white">{status.owner}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-light-gray mb-1">
                    Last Updated
                  </h4>
                  <p className="text-white">
                    {format(new Date(status.lastUpdated), "dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-light-gray mb-1">
                    Priority
                  </h4>
                  <p className="text-white capitalize">{status.priority}</p>
                </div>
              </div>

              {onUpdateStatus && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => onUpdateStatus(status.id, "red")}
                    className={`px-3 py-1 rounded border ${
                      status.currentStatus === "red"
                        ? "bg-danger/20 border-danger text-danger"
                        : "border-danger/30 text-danger/70 hover:bg-danger/10"
                    }`}
                    style={
                      status.currentStatus === "red"
                        ? {
                            backgroundColor: "rgba(220, 53, 69, 0.2)",
                            borderColor: "#DC3545",
                            color: "#DC3545",
                          }
                        : undefined
                    }
                  >
                    Red
                  </button>
                  <button
                    onClick={() => onUpdateStatus(status.id, "amber")}
                    className={`px-3 py-1 rounded border ${
                      status.currentStatus === "amber"
                        ? "bg-amber-500/20 border-amber-500 text-amber-500"
                        : "border-amber-500/30 text-amber-500/70 hover:bg-amber-500/10"
                    }`}
                    style={
                      status.currentStatus === "amber"
                        ? {
                            backgroundColor: "rgba(255, 193, 7, 0.2)",
                            borderColor: "#FFC107",
                            color: "#FFC107",
                          }
                        : undefined
                    }
                  >
                    Amber
                  </button>
                  <button
                    onClick={() => onUpdateStatus(status.id, "green")}
                    className={`px-3 py-1 rounded border ${
                      status.currentStatus === "green"
                        ? "bg-teal/20 border-teal text-teal"
                        : "border-teal/30 text-teal/70 hover:bg-teal/10"
                    }`}
                    style={
                      status.currentStatus === "green"
                        ? {
                            backgroundColor: "rgba(25, 135, 84, 0.2)",
                            borderColor: "#198754",
                            color: "#198754",
                          }
                        : undefined
                    }
                  >
                    Green
                  </button>
                </div>
              )}

              {status.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">
                    Comments
                  </h4>
                  <div className="space-y-2">
                    {status.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-dark-gray p-3 rounded text-sm"
                      >
                        <div className="flex justify-between text-light-gray text-xs mb-1">
                          <span>{comment.author}</span>
                          <span>
                            {format(
                              new Date(comment.timestamp),
                              "dd MMM yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <p className="text-white">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onAddComment && (
                <div className="mt-4">
                  {activeCommentId === status.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full px-3 py-2 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                        placeholder="Add a comment..."
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setActiveCommentId(null);
                            setCommentText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCommentSubmit(status.id)}
                          disabled={!commentText.trim()}
                        >
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveCommentId(status.id)}
                    >
                      Add Comment
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-light-gray">
          {activeFilter !== "all"
            ? `No ${activeFilter} status items found. Try changing the filter.`
            : "No status items available at this time."}
        </div>
      )}
    </div>
  );
}
