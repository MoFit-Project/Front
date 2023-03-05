import RoomListComponent from "../../components/room/RoomListComponent"
import Head from "next/head";
import CreateRoomModal from "../../components/room/CreateRoomModal";
import Loading from "@/components/Loading";
import MultigameResult from "../../components/MultiGameResult"

export default function Test() {

    return (
        <>
            <div className="loading">
                <Loading/>
            </div>
            <style jsx>{`
                .loading{
                    background-color: black;
                    width: 100vw;
                    height: 100vh; /* 화면 전체를 커버하도록 설정 */
                    visibility: visible;
                }
            `}</style>
        </>
    );
}