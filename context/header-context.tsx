"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderConfig {
  titlePrimary?: string;
  titleSecondary?: string;
  description?: string;
}

interface HeaderContextValue {
  config: HeaderConfig;
  setHeader: (config: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextValue>({
  config: {},
  setHeader: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({});
  return (
    <HeaderContext.Provider value={{ config, setHeader: setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  return useContext(HeaderContext);
}