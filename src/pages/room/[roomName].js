import OpenViduComponent from "../../components/openvidu/OpenviduComponent";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRecoilState } from 'recoil';
import { isRoomHostState } from "../../recoil/states";

export default function GameRoom() {
    const token = Cookies.get("token");
    // let base64Payload = token.split('.')[1];
    // let payload = Buffer.from(base64Payload, 'base64');
    // let result = JSON.parse(payload.toString());

    const router = useRouter();
    const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    console.log(isRoomHost);


    useEffect(() => {
        if (!token) router.push("/login");
    }, [])

    const roomName = router.query.roomName;
    //const userName = result.sub;

    return (
        <>
            <title>MOFIT 게임룸</title>
            <OpenViduComponent roomName={roomName} userName={'juhong'} jwtToken={token} />
        </>
    );
}