import Loading from '../components/Loading'
import SingleWebcam from '../components/SingleWebcam'
import { useState } from 'react';



export default function SingleMode() {

    const [isLoad, setIsLoad] = useState(true);
    const [startDetect, setStartDetect] = useState(false);
    return (
        <>
            <title>MOFIT 게임룸</title>
            <div className="loading">
                <Loading/>
            </div>

            <div className="webcam-container">
                <SingleWebcam setIsLoad={setIsLoad} startDetect={startDetect} />
                <button onClick={()=>setStartDetect(true)}> 디텍트 시작</button>
            </div>
            
            <style jsx>{`
                .loading{
                    display: ${isLoad ? 'flex' : 'none'};
                    justify-content: center;
                    align-items: center;
                    background-color: black;
                    width: 100vw;
                    height: 100vh;
                }
                .webcam-container{
                    display: ${isLoad ? 'none' : 'block'};
                }

                `}</style>
        </>

    )
}