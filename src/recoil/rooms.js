import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const roomsState = atom({
    key: "roomsState",
    default: [],
    effects_UNSTABLE: [persistAtom],
})