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

    const [isMovenetLoaded, setIsMovenetLoaded] = useState(false);
    const [isOpenViduLoaded, setIsOpenViduLoaded] = useState(false);
    const [isPhaserLoaded, setIsPhaserLoaded] = useState(true);

    let username;

    useEffect(() => {
        // if (!token) router.push("/login");
        username = window.localStorage.getItem('username');
        setLoading(true);
        
    }, [])
   
    useEffect(() => {
        if (isMovenetLoaded&&isOpenViduLoaded&&isPhaserLoaded)
            setLoading(false);

    }, [isMovenetLoaded, isOpenViduLoaded, isPhaserLoaded])

    //const userName = result.sub;

    return (
        <>
            <title>MOFIT 게임룸</title>
            <div className='curtain'>
                <OpenViduComponent roomName={roomName} userName={username} jwtToken={token}
                    setIsMovenetLoaded={setIsMovenetLoaded} setIsOpenViduLoaded={setIsOpenViduLoaded}
                >
                    {/* <div key={Math.random()} id="game"></div> */}
                    {/* {loading ? <DynamicComponentWithNoSSR style="width:60%" /> : null} */}
                </OpenViduComponent>
            </div>
            <style jsx>{`
                    .curtain{
                        width: 100vh;
                        height: 100vh; /* 화면 전체를 커버하도록 설정 */
                        visibility: ${loading ? 'hidden' : 'visible'}; 
                    }
                `}</style>

        </>

    );
}