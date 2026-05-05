"use client";

import { useEffect, useState } from "react";

import { useI18n } from "@/contexts/I18nContext";
import { useRoomStore } from "@/lib/store";

export function PersistGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const done = () => setReady(true);
    const unsub = useRoomStore.persist.onFinishHydration(done);
    void useRoomStore.persist.rehydrate();
    return unsub;
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center bg-app text-sm text-ink-soft">
        {t("common.loading")}
      </div>
    );
  }

  return <>{children}</>;
}
