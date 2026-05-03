"use client";

import { useEffect, useState } from "react";
import { useRoomStore } from "@/lib/store";

export function PersistGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => setReady(true);
    const unsub = useRoomStore.persist.onFinishHydration(done);
    void useRoomStore.persist.rehydrate();
    return unsub;
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center bg-app text-sm text-ink-soft">
        載入本機資料…
      </div>
    );
  }

  return <>{children}</>;
}
