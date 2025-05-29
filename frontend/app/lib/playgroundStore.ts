import { create } from "zustand";

type Position = { x: number; y: number };

export type PlaygroundObject = {
  id: string;
  type: string;
  position: Position;
};

type InstanceStore = {
  instance: PlaygroundObject[];
  setInstance: (data: PlaygroundObject[]) => void;
  addInstanceObject: (obj: PlaygroundObject) => void;
  removeInstanceObject: (id: string) => void;
  clearInstance: () => void;
  saveInstanceToLocalStorage: () => void;
  loadInstanceFromLocalStorage: () => void;
};

export const useInstanceStore = create<InstanceStore>((set, get) => ({
  instance: [],
  setInstance: (data) => set({ instance: data }),
  addInstanceObject: (obj) =>
    set((state) => ({ instance: [...state.instance, obj] })),
  removeInstanceObject: (id) =>
    set((state) => ({
      instance: state.instance.filter((obj) => obj.id !== id),
    })),
  clearInstance: () => set({ instance: [] }),
  saveInstanceToLocalStorage: () => {
    const instance = get().instance;
    localStorage.setItem("playground_instance", JSON.stringify(instance));
  },
  loadInstanceFromLocalStorage: () => {
    
    const raw = localStorage.getItem("playground_instance");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        
        if (Array.isArray(parsed)) {
          if (
            parsed.every(
              (obj) =>
                typeof obj.id === "string" &&
                obj.position &&
                typeof obj.position.x === "number"
            )
          ) {
            set({ instance: parsed });
          }
          
        }
      } catch (err) {
        console.error("Invalid JSON in localStorage:", err);
      }
    }
  },
}));

type ViewportStore = {
  stageScale: number;
  stagePosition: Position;
  setStageScale: (scale: number) => void;
  setStagePosition: (pos: Position) => void;
};

export const useViewportStore = create<ViewportStore>((set) => ({
  stageScale: 1,
  stagePosition: { x: 0, y: 0 },
  setStageScale: (scale) => set({ stageScale: scale }),
  setStagePosition: (pos) => set({ stagePosition: pos }),
}));
