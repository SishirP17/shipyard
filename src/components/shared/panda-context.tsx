"use client";

import { createContext, useContext, useState } from "react";

type PandaCtx = { visible: boolean; toggle: () => void };

const Ctx = createContext<PandaCtx>({ visible: false, toggle: () => {} });

export function PandaProvider({ children }: { children: React.ReactNode }) {
  // Always starts OFF on a fresh load. The choice is intentionally *not*
  // persisted — it lives only in this provider, so it carries across in-session
  // client navigation but resets to off whenever the app is reopened.
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);

  return <Ctx.Provider value={{ visible, toggle }}>{children}</Ctx.Provider>;
}

export const usePanda = () => useContext(Ctx);
