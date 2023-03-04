import { useRef, useEffect } from "react";

export default function SubVideo({ streamManager, userName, }) {

    const videoRef = useRef(null);
    useEffect(() => {
        if (streamManager && !!videoRef.current) {
            console.log(streamManager);
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <video autoPlay={true} ref={videoRef} style={{  width: "500px", height: "800px" }}/>;
}
