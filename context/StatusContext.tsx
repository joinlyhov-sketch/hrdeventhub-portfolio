"use client";

import { createContext, useContext, useState } from "react";

export type ActiveStatus = "online" | "idle" | "do-not-disturb" | "offline";

interface StatusContextType {
  activeStatus: ActiveStatus;
  setActiveStatus: (status: ActiveStatus) => void;
  isDoNotDisturb: boolean;
}

const StatusContext = createContext<StatusContextType>({
  activeStatus: "online",
  setActiveStatus: () => {},
  isDoNotDisturb: false,
});

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [activeStatus, setActiveStatus] = useState<ActiveStatus>("online");

  return (
    <StatusContext.Provider
      value={{
        activeStatus,
        setActiveStatus,
        isDoNotDisturb: activeStatus === "do-not-disturb",
      }}
    >
      {children}
    </StatusContext.Provider>
  );
}

export const useStatusContext = () => useContext(StatusContext);
