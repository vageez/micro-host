import { create } from "zustand";
import { persist } from "zustand/middleware";

const createAppSlice = (set, _) => ({
  micro: "host",
  setMicro: (micro) => set({ micro }),
});

const useAppStore = create(
  persist(
    (set) => ({
      ...createAppSlice(set),
    }),
    { name: "awe-store" }
  )
);

export default useAppStore;
