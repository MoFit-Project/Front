import OpenViduComponent from "../../components/openvidu/OpenviduComponent";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRecoilState } from 'recoil';
import { isRoomHostState } from "../../recoil/states";
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
    () => import('../../components/MultiGame/Index'),
    { ssr: false }
)

export default function GameRoom() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");
    const roomName = router.query.roomName;
    const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    let username;

    const movenetRef = useRef(false);
    const gameRef = useRef(true);
    const openViduRef = useRef(false);


    useEffect(() => {
        // if (!token) router.push("/login");
        username = window.localStorage.getItem('username');
        console.log(isRoomHost);
    }, [])

    useEffect(() => {
        if (movenetRef.current && game.current && openvidu.current)
            setLoading(true);
        console.log(movenetRef.current)
        console.log(gameRef.current)
        console.log(openViduRef.current)
    }, [movenetRef, gameRef, openViduRef])

    return (
        <>
            <title>MOFIT 게임룸</title>
            <OpenViduComponent roomName={roomName} userName={username} jwtToken={token}>
                <div key={Math.random()} id="game"></div>
                {loading ? <DynamicComponentWithNoSSR style="width:60%" /> : null}
            </OpenViduComponent>
        </>

    );
}