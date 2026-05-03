import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { InspireImage, Room } from "@/lib/types";

function now() {
  return Date.now();
}

type RoomPatch = Partial<
  Omit<Room, "id" | "createdAt"> & { updatedAt?: number }
>;

type State = {
  rooms: Room[];
  addRoom: (name: string) => string;
  updateRoom: (id: string, patch: RoomPatch) => void;
  removeRoom: (id: string) => void;
  addImage: (roomId: string, image: Omit<InspireImage, "id">) => void;
  removeImage: (roomId: string, imageId: string) => void;
};

export const useRoomStore = create<State>()(
  persist(
    (set, get) => ({
      rooms: [],

      addRoom: (name) => {
        const id = nanoid();
        const t = now();
        const trimmed = name.trim() || "未命名空間";
        set((s) => ({
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
              createdAt: t,
              updatedAt: t,
            },
          ],
        }));
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
        set((s) => ({ rooms: s.rooms.filter((r) => r.id !== id) }));
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
    }),
    {
      name: "interior-mood-translator-rooms",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ rooms: s.rooms }),
    },
  ),
);
