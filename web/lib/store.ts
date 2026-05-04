import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import { defaultRoomOrder } from "@/lib/roomOrder";
import type { FurnitureItem, InspireImage, Room } from "@/lib/types";

function now() {
  return Date.now();
}

type RoomPatch = Partial<
  Omit<Room, "id" | "createdAt"> & { updatedAt?: number }
>;

type State = {
  rooms: Room[];
  /** 首頁／批次 PDF 顯示順序；空陣列表示沿用更新時間排序 */
  roomOrder: string[];
  addRoom: (name: string) => string;
  updateRoom: (id: string, patch: RoomPatch) => void;
  removeRoom: (id: string) => void;
  setRoomOrder: (order: string[]) => void;
  addImage: (roomId: string, image: Omit<InspireImage, "id">) => void;
  removeImage: (roomId: string, imageId: string) => void;
  addFurniture: (
    roomId: string,
    item: Omit<FurnitureItem, "id">,
  ) => void;
  removeFurniture: (roomId: string, furnitureId: string) => void;
};

export const useRoomStore = create<State>()(
  persist(
    (set, get) => ({
      rooms: [],
      roomOrder: [],

      addRoom: (name) => {
        const id = nanoid();
        const t = now();
        const trimmed = name.trim() || "未命名空間";
        set((s) => {
          const baseOrder =
            s.roomOrder.length > 0
              ? s.roomOrder
              : defaultRoomOrder(s.rooms);
          return {
            rooms: [
              ...s.rooms,
              {
                id,
                name: trimmed,
                notes: "",
                avoidNotes: "",
                styleTags: [],
                colorTags: [],
                images: [],
                furniture: [],
                createdAt: t,
                updatedAt: t,
              },
            ],
            roomOrder: [...baseOrder, id],
          };
        });
        return id;
      },

      updateRoom: (id, patch) => {
        set((s) => ({
          rooms: s.rooms.map((r) =>
            r.id === id
              ? { ...r, ...patch, updatedAt: now() }
              : r,
          ),
        }));
      },

      removeRoom: (id) => {
        set((s) => {
          const orderBase =
            s.roomOrder.length > 0
              ? s.roomOrder
              : defaultRoomOrder(s.rooms);
          return {
            rooms: s.rooms.filter((r) => r.id !== id),
            roomOrder: orderBase.filter((oid) => oid !== id),
          };
        });
      },

      setRoomOrder: (order) => {
        const roomList = get().rooms;
        const valid = new Set(roomList.map((r) => r.id));
        const filtered = order.filter((oid) => valid.has(oid));
        const seen = new Set(filtered);
        const tail = roomList
          .filter((r) => !seen.has(r.id))
          .map((r) => r.id);
        set({ roomOrder: [...filtered, ...tail] });
      },

      addImage: (roomId, image) => {
        const row = get().rooms.find((r) => r.id === roomId);
        if (!row) return;
        const next: InspireImage = { ...image, id: nanoid() };
        get().updateRoom(roomId, { images: [...row.images, next] });
      },

      removeImage: (roomId, imageId) => {
        const row = get().rooms.find((r) => r.id === roomId);
        if (!row) return;
        get().updateRoom(roomId, {
          images: row.images.filter((i) => i.id !== imageId),
        });
      },

      addFurniture: (roomId, item) => {
        const row = get().rooms.find((r) => r.id === roomId);
        if (!row) return;
        const next: FurnitureItem = { ...item, id: nanoid() };
        const list = row.furniture ?? [];
        get().updateRoom(roomId, { furniture: [...list, next] });
      },

      removeFurniture: (roomId, furnitureId) => {
        const row = get().rooms.find((r) => r.id === roomId);
        if (!row) return;
        const list = row.furniture ?? [];
        get().updateRoom(roomId, {
          furniture: list.filter((f) => f.id !== furnitureId),
        });
      },
    }),
    {
      name: "interior-mood-translator-rooms",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ rooms: s.rooms, roomOrder: s.roomOrder }),
    },
  ),
);
