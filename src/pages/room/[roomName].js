import OpenViduComponent from "../../components/openvidu/OpenviduComponent";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import NavBar from './../../components/Navbar';

export default function GameRoom() {
    const token = Cookies.get("token");
    const router = useRouter();

    useEffect(() => {
        if (!token) router.push("/login");
    }, [])

    const roomName = router.query.roomName;
    const userName = "juhong";

    return (
        <>
            <OpenViduComponent roomName={roomName} userName={userName} jwtToken={token} />
        </>
    );
}