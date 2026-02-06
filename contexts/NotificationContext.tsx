"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  getNotificationStacks,
  setNotificationStacks,
  setLastVisit,
} from "@/lib/notificationPreferences";

interface NotificationContextType {
  selectedStacks: string[];
  setSelectedStacks: (stacks: string[]) => void;
  toggleStack: (stack: string) => void;
  addStack: (stack: string) => void;
  removeStack: (stack: string) => void;
  hasStack: (stack: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [selectedStacks, setSelectedStacksState] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSelectedStacksState(getNotificationStacks());
    setMounted(true);
  }, []);

  const setSelectedStacks = useCallback((stacks: string[]) => {
    setNotificationStacks(stacks);
    setSelectedStacksState(stacks);
  }, []);

  const toggleStack = useCallback((stack: string) => {
    const current = getNotificationStacks();
    const newStacks = current.includes(stack)
      ? current.filter((s) => s !== stack)
      : [...current, stack];
    setNotificationStacks(newStacks);
    setSelectedStacksState(newStacks);
  }, []);

  const addStack = useCallback((stack: string) => {
    const current = getNotificationStacks();
    if (!current.includes(stack)) {
      const newStacks = [...current, stack];
      setNotificationStacks(newStacks);
      setSelectedStacksState(newStacks);
    }
  }, []);

  const removeStack = useCallback((stack: string) => {
    const newStacks = getNotificationStacks().filter((s) => s !== stack);
    setNotificationStacks(newStacks);
    setSelectedStacksState(newStacks);
  }, []);

  const hasStack = useCallback((stack: string) => {
    if (!mounted) return false;
    return getNotificationStacks().includes(stack);
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      setLastVisit();
    }
  }, [mounted]);

  const value: NotificationContextType = {
    selectedStacks: mounted ? selectedStacks : [],
    setSelectedStacks,
    toggleStack,
    addStack,
    removeStack,
    hasStack,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationPreferences debe usarse dentro de NotificationProvider"
    );
  }
  return context;
}
