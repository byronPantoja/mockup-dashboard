"use client";

import { useState, useCallback } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { DEMO_TASKS, PIPELINE_STATS } from "@/lib/seed-data";
import type { Task } from "@/lib/types";

export default function TasksSidebar({
  onTaskComplete,
}: {
  onTaskComplete?: (title: string) => void;
}) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, completed: !t.completed };
          if (next.completed) onTaskComplete?.(t.title);
          return next;
        })
      );
    },
    [onTaskComplete]
  );

  return (
    <aside className="w-full xl:w-72 shrink-0 bg-surface-lowest p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-on-surface">Upcoming Tasks</h2>
        <span className="rounded-lg bg-primary-container/30 px-2 py-0.5 text-xs font-medium text-primary">
          {tasks.filter((t) => !t.completed).length}
        </span>
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-low ${
              task.completed ? "opacity-50" : ""
            } ${task.completed ? "animate-confetti-pop" : ""}`}
          >
            {task.completed ? (
              <CheckCircle2 size={18} className="mt-0.5 text-primary shrink-0" />
            ) : (
              <Circle
                size={18}
                className="mt-0.5 text-on-surface/20 group-hover:text-on-surface/40 shrink-0 transition-colors"
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm text-on-surface ${
                  task.completed ? "line-through text-on-surface/40" : ""
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-on-surface/40 font-mono mt-0.5">
                {task.due}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Pipeline Summary */}
      <div className="pt-4 mt-4">
        <h3 className="text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-3">
          Pipeline Summary
        </h3>
        <div className="space-y-2.5">
          {PIPELINE_STATS.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-on-surface/70">{s.label}</span>
                <span className="font-mono text-on-surface/50">{s.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-high overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color} transition-all`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
