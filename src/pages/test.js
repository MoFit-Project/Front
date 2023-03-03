import RoomListComponent from "../components/room/RoomListComponent"
import Head from "next/head";
import CreateRoomModal from "../components/room/CreateRoomModal";

export default function Test() {

    return (

        <div>
            <Head>
                <link
                    rel="preload"
                    href="fonts/dalmoori.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/galmuri@latest/dist/galmuri.css"></link>
            </Head>

            <div className="pixel-borders pixel-borders--custom pixel-test ">
                gdgd
                <CreateRoomModal />
                <RoomListComponent />

            </div>

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