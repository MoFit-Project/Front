import { atom } from "recoil";

export const leftPlayerThrow = atom({
    key: "leftPlayerThrow",
    default: 100,
})

export const rightPlayerThrow = atom({
    key: "rightPlayerThrow",
    default: false,
})