"use client";

import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import { reorderIds } from "@/lib/roomOrder";
import { useRoomStore } from "@/lib/store";
import type { Room } from "@/lib/types";

type Props = {
  rooms: Room[];
  onReorder: (orderedIds: string[]) => void;
};

function GripIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className="h-5 w-5"
      {...props}
    >
      <circle cx="7" cy="6" r="1.25" />
      <circle cx="13" cy="6" r="1.25" />
      <circle cx="7" cy="10" r="1.25" />
      <circle cx="13" cy="10" r="1.25" />
      <circle cx="7" cy="14" r="1.25" />
      <circle cx="13" cy="14" r="1.25" />
    </svg>
  );
}

function sameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

export function SortableRoomList({ rooms, onReorder }: Props) {
  const removeRoom = useRoomStore((s) => s.removeRoom);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overRowIndex, setOverRowIndex] = useState<number | null>(null);
  const [overGapInsertBefore, setOverGapInsertBefore] = useState<number | null>(
    null,
  );

  const ids = rooms.map((r) => r.id);

  const commitInsertBefore = useCallback(
    (fromIdx: number, insertBefore: number) => {
      if (fromIdx < 0) return;
      if (insertBefore < 0 || insertBefore > ids.length) return;
      const next = reorderIds(ids, fromIdx, insertBefore);
      if (sameOrder(next, ids)) return;
      onReorder(next);
    },
    [ids, onReorder],
  );

  const endDrag = useCallback(() => {
    setDraggingId(null);
    setOverRowIndex(null);
    setOverGapInsertBefore(null);
  }, []);

  return (
    <ul className="mt-4 flex flex-col gap-0">
      {rooms.map((r, index) => (
        <Fragment key={r.id}>
          {index > 0 ? (
            <li
              className={`relative z-[1] -my-1.5 list-none py-2 ${
                overGapInsertBefore === index ? "rounded-md bg-accent/15" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "move";
                setOverGapInsertBefore(index);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOverGapInsertBefore((prev) =>
                    prev === index ? null : prev,
                  );
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const fromId = e.dataTransfer.getData("text/plain");
                const fromIdx = ids.indexOf(fromId);
                commitInsertBefore(fromIdx, index);
                endDrag();
              }}
            >
              <div
                className="mx-auto h-1 max-w-xs rounded-full bg-border-warm/80"
                aria-hidden
              />
            </li>
          ) : null}

          <li
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setOverRowIndex(index);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setOverRowIndex((prev) => (prev === index ? null : prev));
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromId = e.dataTransfer.getData("text/plain");
              const fromIdx = ids.indexOf(fromId);
              if (fromIdx < 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const insertBefore =
                e.clientY < rect.top + rect.height / 2 ? index : index + 1;
              commitInsertBefore(fromIdx, insertBefore);
              endDrag();
            }}
            className={
              overRowIndex === index && draggingId && draggingId !== r.id
                ? "rounded-xl ring-2 ring-accent/40 ring-offset-2 ring-offset-app"
                : ""
            }
          >
            <div
              className={`flex items-stretch gap-0 rounded-xl bg-surface shadow-card transition hover:bg-peach/30 hover:shadow-lg ${draggingId === r.id ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", r.id);
                  e.dataTransfer.effectAllowed = "move";
                  setDraggingId(r.id);
                }}
                onDragEnd={endDrag}
                className="flex shrink-0 cursor-grab touch-none items-center rounded-l-xl bg-peach/15 px-2 text-ink-soft transition hover:bg-peach/25 hover:text-ink active:cursor-grabbing"
                aria-label={`拖移排序：${r.name}`}
              >
                <GripIcon />
              </button>
              <Link
                href={`/room/${r.id}`}
                className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-4 no-underline"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {r.images.length} 張圖 ·{" "}
                    {new Date(r.updatedAt).toLocaleString("zh-TW")}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-accent-hover">
                  編輯 →
                </span>
              </Link>
              <div className="flex shrink-0 flex-col justify-center gap-0.5 bg-app/60 py-2 pr-2 pl-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.preventDefault();
                    commitInsertBefore(index, index - 1);
                  }}
                  className="rounded-md px-2 py-1 text-xs text-ink-soft hover:bg-peach/40 hover:text-ink disabled:opacity-30"
                  aria-label={`將「${r.name}」上移`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index >= rooms.length - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    commitInsertBefore(
                      index,
                      Math.min(index + 2, ids.length),
                    );
                  }}
                  className="rounded-md px-2 py-1 text-xs text-ink-soft hover:bg-peach/40 hover:text-ink disabled:opacity-30"
                  aria-label={`將「${r.name}」下移`}
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (
                    !window.confirm(
                      `確定要刪除「${r.name}」嗎？此空間內的靈感與設定會一併從本機移除，且無法復原。`,
                    )
                  ) {
                    return;
                  }
                  removeRoom(r.id);
                }}
                className="flex shrink-0 items-center self-stretch rounded-r-xl bg-peach/10 px-3 text-xs font-medium text-danger transition hover:bg-danger-surface"
                aria-label={`刪除空間：${r.name}`}
              >
                刪除
              </button>
            </div>
          </li>
        </Fragment>
      ))}
    </ul>
  );
}
