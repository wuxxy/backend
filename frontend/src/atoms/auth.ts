import { atom } from "jotai";

export const authAtom = atom(localStorage.getItem("backman_pass"));
