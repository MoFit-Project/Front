import { useEffect, useRef } from "react";
import { useRecoilState } from 'recoil';
import { isRoomHostState } from "../../recoil/states";


export default function OvVideo({ streamManager, userName }) {
    const videoRef = useRef(null);
    //const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
    //console.log(isRoomHost);
    useEffect(() => {
        if (streamManager && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (

        <video autoPlay={true} ref={videoRef} />
    );
}