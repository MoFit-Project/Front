import { atom } from "recoil";

export const isRoomHostState = atom({
    key: "isRoomHostState",
    default: { roomName: '', isHost: false },
});