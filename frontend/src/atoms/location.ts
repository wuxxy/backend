import { atom } from "jotai";

export const currentPathAtom = atom<string>(location.pathname);
