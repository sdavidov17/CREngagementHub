"use client";

import React, { useState } from "react";
import { Objective, KeyResult } from "@/types/okr";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface EnhancedObjectiveCardProps {
  objective: Objective;
  onUpdateKeyResult?: (
    objectiveId: string,
    keyResultId: string,
    progress: number
  ) => void;
  onAddComment?: (
    objectiveId: string,
    keyResultId: string,
    comment: string
  ) => void;
}

export function EnhancedObjectiveCard({
  objective,
  onUpdateKeyResult,
  onAddComment,
}: EnhancedObjectiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeKeyResultId, setActiveKeyResultId] = useState<string | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
  const [editingProgress, setEditingProgress] = useState<{
    id: string;
    value: number;
  } | null>(null);

  const calculateObjectiveProgress = () => {
    if (objective.keyResults.length === 0) return 0;

    const totalProgress = objective.keyResults.reduce(
      (acc, kr) => acc + kr.progress,
      0
    );
    return Math.round(totalProgress / objective.keyResults.length);
  };

  const getStatusColor = (
    status: "on_track" | "at_risk" | "behind" | "completed"
  ) => {
    switch (status) {
      case "on_track":
        return "text-teal bg-teal/10";
      case "at_risk":
        return "text-amber-500 bg-amber-500/10";
      case "behind":
        return "text-danger bg-danger/10";
      case "completed":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-light-gray bg-light-gray/10";
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return "success";
    if (progress >= 70) return "default";
    if (progress >= 40) return "warning";
    return "danger";
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleProgressUpdate = (keyResultId: string) => {
    if (editingProgress && onUpdateKeyResult) {
      onUpdateKeyResult(objective.id, keyResultId, editingProgress.value);
      setEditingProgress(null);
    }
  };

  const handleCommentSubmit = (keyResultId: string) => {
    if (commentText.trim() && onAddComment) {
      onAddComment(objective.id, keyResultId, commentText);
      setCommentText("");
      setActiveKeyResultId(null);
    }
  };

  const objectiveProgress = calculateObjectiveProgress();

  return (
    <Card
      className={`transition-all duration-200 ${
        expanded ? "border-teal/30" : ""
      }`}
    >
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white">
              {objective.title}
            </h3>
            <Badge className={getStatusColor(objective.status)}>
              {formatStatus(objective.status)}
            </Badge>
          </div>

          <p className="text-light-gray text-sm mt-1">
            {objective.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-light-gray">
              Quarter: {objective.quarter}
            </span>
            <span className="text-xs text-light-gray">•</span>
            <span className="text-xs text-light-gray">
              Owner: {objective.owner}
            </span>
            <span className="text-xs text-light-gray">•</span>
            <span className="text-xs text-light-gray">
              {objective.keyResults.length} Key Results
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {objectiveProgress}%
            </div>
            <div className="text-xs text-light-gray">Progress</div>
          </div>

          {expanded ? (
            <ChevronUpIcon className="h-5 w-5 text-light-gray" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-light-gray" />
          )}
        </div>
      </div>

      <ProgressBar
        value={objectiveProgress}
        max={100}
        color={getProgressBarColor(objectiveProgress)}
        className="mt-4"
        showLabel={false}
      />

      {expanded && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-white">Key Results</h4>

          {objective.keyResults.map((keyResult) => (
            <div
              key={keyResult.id}
              className="pl-4 border-l-2 border-dark-gray pt-2 pb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-white">
                      {keyResult.title}
                    </h5>
                    <Badge className={getStatusColor(keyResult.status)}>
                      {formatStatus(keyResult.status)}
                    </Badge>
                  </div>

                  <p className="text-sm text-light-gray mt-1">
                    {keyResult.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-white">
                    {keyResult.progress}%
                  </div>
                  <div className="text-xs text-light-gray">Progress</div>
                </div>
              </div>

              <ProgressBar
                value={keyResult.progress}
                max={100}
                color={getProgressBarColor(keyResult.progress)}
                className="mt-2"
                showLabel={false}
                size="sm"
              />

              {onUpdateKeyResult && (
                <div className="mt-4">
                  {editingProgress && editingProgress.id === keyResult.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={editingProgress.value}
                        onChange={(e) =>
                          setEditingProgress({
                            id: keyResult.id,
                            value: parseInt(e.target.value),
                          })
                        }
                        className="flex-grow"
                      />
                      <span className="text-white w-8">
                        {editingProgress.value}%
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => setEditingProgress(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => handleProgressUpdate(keyResult.id)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProgress({
                          id: keyResult.id,
                          value: keyResult.progress,
                        });
                      }}
                    >
                      Update Progress
                    </Button>
                  )}
                </div>
              )}

              {keyResult.comments && keyResult.comments.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-sm font-medium text-white mb-2">
                    Latest Comments
                  </h6>
                  <div className="space-y-2">
                    {keyResult.comments.slice(0, 2).map((comment, index) => (
                      <div
                        key={index}
                        className="bg-dark-gray p-2 rounded text-xs"
                      >
                        <div className="flex justify-between text-light-gray mb-1">
                          <span>{comment.author}</span>
                          <span>
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white">{comment.text}</p>
                      </div>
                    ))}
                    {keyResult.comments.length > 2 && (
                      <div className="text-xs text-teal cursor-pointer hover:underline">
                        View all {keyResult.comments.length} comments
                      </div>
                    )}
                  </div>
                </div>
              )}

              {onAddComment && (
                <div className="mt-4">
                  {activeKeyResultId === keyResult.id ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full px-2 py-1 bg-dark-gray border border-dark-gray rounded-md text-white focus:outline-none focus:ring-1 focus:ring-teal resize-none text-sm"
                        placeholder="Add a comment..."
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveKeyResultId(null);
                            setCommentText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCommentSubmit(keyResult.id);
                          }}
                          disabled={!commentText.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveKeyResultId(keyResult.id);
                      }}
                    >
                      Add Comment
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
