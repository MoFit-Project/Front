import OpenViduComponent from "../../components/openvidu/OpenviduComponent";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRecoilState } from 'recoil';
import { isRoomHostState } from "../../recoil/states";
import dynamic from 'next/dynamic'
import Loading from '../../components/Loading'

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


    return (
        <>
            <title>MOFIT 게임룸</title>
            <div className='curtain'>
                <OpenViduComponent roomName={roomName} userName={username} jwtToken={token}
                    setIsMovenetLoaded={setIsMovenetLoaded} setIsOpenViduLoaded={setIsOpenViduLoaded}>
                </OpenViduComponent>
            </div>

            <div className="loading">
                <div>
                    <Loading/>
                </div>
            </div>
            <style jsx>{`
                    .curtain{
                        display: ${loading ? 'none' : 'block'}; 
                    }
                    .loading{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: black;
                        width: 100vw;
                        height: 100vh; 
                        visibility: ${loading ? 'visible' : 'hidden'};
                    }

                `}</style>

        </>

    );
}