import OpenViduComponent from "../../components/OpenviduComponent";
import { useRouter } from "next/router";

export default function GameRoom() {
    const router = useRouter();
    const roomName = router.query.roomName;
    const userName = "juhong";

    return (
        <>
            <OpenViduComponent roomName={roomName} userName={userName} />
        </>
    );
}