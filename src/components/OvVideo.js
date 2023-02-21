import { useEffect, useRef } from "react";

export default function OvVideo(props) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (props && !!videoRef.current) {
            //console.log(props.streamManager);
            props.streamManager.addVideoElement(videoRef.current);
        }
    }, [props]);

    return <video autoPlay={true} ref={videoRef} />;
}