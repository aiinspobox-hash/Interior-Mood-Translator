import type { Room } from "@/lib/types";

/** 與首頁預設一致：依更新時間新到舊 */
export function defaultRoomOrder(rooms: Room[]): string[] {
  return [...rooms]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((r) => r.id);
}

/** 依 `roomOrder` 排列；若為空則等同 `defaultRoomOrder`；多出／缺少的 id 會補齊 */
export function orderedRooms(rooms: Room[], roomOrder: string[]): Room[] {
  if (rooms.length === 0) return [];
  const byId = new Map(rooms.map((r) => [r.id, r]));
  const base =
    roomOrder.length > 0
      ? roomOrder.filter((id) => byId.has(id))
      : defaultRoomOrder(rooms);
  const seen = new Set(base);
  const tail = defaultRoomOrder(rooms.filter((r) => !seen.has(r.id)));
  const ids = [...base, ...tail.filter((id) => !seen.has(id))];
  return ids.map((id) => byId.get(id)!).filter(Boolean);
}

/**
 * 將 `fromIndex` 的元素移到「插到原陣列索引 `insertBefore` 之前」；
 * `insertBefore === ids.length` 表示插到最後。
 * （拖曳語意：列上半＝插到該列之前；列下半＝插到該列之後／下一列之前。）
 */
export function reorderIds(
  ids: string[],
  fromIndex: number,
  insertBefore: number,
): string[] {
  const n = ids.length;
  if (n === 0) return [...ids];
  if (fromIndex < 0 || fromIndex >= n) return [...ids];
  if (insertBefore < 0 || insertBefore > n) return [...ids];
  if (fromIndex === insertBefore) return [...ids];

  const next = [...ids];
  const [removed] = next.splice(fromIndex, 1);
  if (removed === undefined) return [...ids];

  let insertAt = insertBefore;
  if (fromIndex < insertBefore) insertAt = insertBefore - 1;
  if (insertAt < 0) insertAt = 0;
  if (insertAt > next.length) insertAt = next.length;

  next.splice(insertAt, 0, removed);
  return next;
}
