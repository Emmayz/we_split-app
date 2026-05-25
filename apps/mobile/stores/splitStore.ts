import { create } from "zustand";
import { Split } from "@wesplit/shared";

interface SplitState {
  activeSplit: Split | null;
  setActiveSplit: (split: Split) => void;
  clearActiveSplit: () => void;
}

export const useSplitStore = create<SplitState>((set) => ({
  activeSplit: null,
  setActiveSplit: (split) => set({ activeSplit: split }),
  clearActiveSplit: () => set({ activeSplit: null }),
}));
