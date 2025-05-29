import type { PlaygroundObject } from "./playgroundStore";

export const addRequest = (
  addInstance: (obj: PlaygroundObject) => void,
  position: { x: number; y: number },
) => {
  addInstance({
    id: `${Date.now()}-${Math.random()}`,
    type: "request",
    position: position,
  });
};