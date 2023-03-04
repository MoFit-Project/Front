import RoomListComponent from "../components/room/RoomListComponent"
import Head from "next/head";
import CreateRoomModal from "../components/room/CreateRoomModal";

export default function Test() {

    return (

        <div>


            <CreateRoomModal />


            <style jsx>{`
                .pixel-test{
                    width: 380px;
                    height: 200px;

                }
                 .pixel-borders {

                }
                `}</style>
        </div>
    );
}