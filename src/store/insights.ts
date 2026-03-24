import { create } from "zustand";

type InsightsState = {
  generatingCount: number;
  setGeneratingCount: (count: number) => void;
};

export const useInsightsStore = create<InsightsState>((set) => ({
  generatingCount: 0,
  setGeneratingCount: (count) => set({ generatingCount: count }),
}));
