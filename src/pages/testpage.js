import RoomListComponent from './../components/room/RoomListComponent';
import LoginButton from './../components/login/LoginButton';
import { useRef, useEffect } from 'react';

export default function TestPage() {

    const videoRef = useRef(null);
    useEffect(() => {
        async function getMediaStream() {
            try {
                const constraints = {
                    video: { width: 300, height: 800 }
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            } catch (error) {
                console.error("Error accessing media devices.", error);
            }
        }
        getMediaStream();
    }, [])

    return (
        <div id="container">
            <video className="videoElement" ref={videoRef} width={600} height={800} />
            <style jsx>{`
                    #container {
                        width: 600px;
                        height: 800px;
                        border: 10px #333 solid;
                    }
                    .videoElement {
                        width: 600px;
                        height: 800px;
                        background-color: #666;
                    }
                `}</style>
        </div >
    )
}