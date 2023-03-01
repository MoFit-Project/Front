import OpenViduComponent from "../../components/openvidu/OpenviduComponent";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
    let username



    useEffect(() => {
        // if (!token) router.push("/login");
        username = window.localStorage.getItem('username');
        setLoading(true)
    }, [])

    //const userName = result.sub;

    return (
        <>
            <title>MOFIT 게임룸</title>
            <OpenViduComponent roomName={roomName} userName={username} jwtToken={token} />
            <div key={Math.random()} id="game"></div>
            {loading ? <DynamicComponentWithNoSSR /> : null}
        </>
    );
}