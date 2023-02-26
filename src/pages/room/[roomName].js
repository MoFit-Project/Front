import OpenViduComponent from "../../components/OpenviduComponent";
import { useRouter } from "next/router";
import { useRef, useEffect } from "react";
import Cookies from "js-cookie";

export default function GameRoom() {
    const token = Cookies.get("token");
    const router = useRouter();

    useEffect(() => {
        if (!token) router.push("/login");
    }, [])

    const roomName = router.query.roomName;
    const userName = "juhong";

    return (
        <OpenViduComponent roomName={roomName} userName={userName} jwtToken={token} />
    );
}