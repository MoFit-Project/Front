import RoomListComponent from "../../components/room/RoomListComponent"
import Head from "next/head";
import CreateRoomModal from "../../components/room/CreateRoomModal";
import Loading from "@/components/Loading";
import MultigameResult from "../../components/MultiGameResult"

export default function Test() {

    return (
        <>
            <CreateRoomModal isOpen={true} isClose={false} />
        </>
    );
}