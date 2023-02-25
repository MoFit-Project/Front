import { useEffect, useRef } from "react";

export default function OvVideo({ streamManager }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (streamManager && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <video autoPlay={true} ref={videoRef} />
    );
}