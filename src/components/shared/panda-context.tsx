"use client";

import { createContext, useContext, useEffect, useState } from "react";

type PandaCtx = { visible: boolean; toggle: () => void };

const Ctx = createContext<PandaCtx>({ visible: true, toggle: () => {} });

const STORAGE_KEY = "panda-visible";

export function PandaProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  // Restore the saved preference once on the client.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) setVisible(stored === "true");
  }, []);

  const toggle = () =>
    setVisible((v) => {
      const next = !v;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });

  return <Ctx.Provider value={{ visible, toggle }}>{children}</Ctx.Provider>;
}

export const usePanda = () => useContext(Ctx);
