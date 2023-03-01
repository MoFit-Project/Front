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
    
    const token = Cookies.get("token");
    // let base64Payload = token.split('.')[1];
    // let payload = Buffer.from(base64Payload, 'base64');
    // let result = JSON.parse(payload.toString());

    const router = useRouter();
    const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    console.log(isRoomHost);


    useEffect(() => {
        // if (!token) router.push("/login");
        setLoading(true)
    }, [])

    const roomName = router.query.roomName;
    //const userName = result.sub;

    return (
        <>
            <title>MOFIT 게임룸</title>
            <OpenViduComponent roomName={roomName} userName={'juhong'} jwtToken={token} />
            <div key={Math.random()} id="game"></div>
            {loading ? <DynamicComponentWithNoSSR /> : null}
        </>
    );
}