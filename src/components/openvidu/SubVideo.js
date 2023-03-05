import { useRef, useEffect } from "react";

export default function SubVideo({ streamManager, userName, }) {

    const videoRef = useRef(null);
    useEffect(() => {
        if (streamManager && !!videoRef.current) {
            console.log(streamManager);
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return (
        <div className="video-container">
			<span className="user-name">{userName}</span>
			<video autoPlay={true} ref={videoRef} style={{  width: "500px" }}/>

			<style jsx>{`
				.video-container{
					position: relative;
					display: inline-block;
					border: 3px solid black;
					margin: 0px 0px 0px 0px;
				}
				.user-name{
					position: absolute;
					top:0;right:0;bottom:0;left:0;
					display: flex;
					justify-content: center;
					font-size: 24px;
					background-color: ;
				}
				
				`}</style>
		</div>
    
    )
}
