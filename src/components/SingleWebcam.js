import { useRef, useEffect, useState } from 'react';
import {
    leftCalculateAngle,
    rightCalculateAngle,
    calculateAngle,
} from "../../public/detector.js";
import * as poseDetection from '@tensorflow-models/pose-detection';
import {
    motionStart,
    squatDetect,
    jumpingJackDetect,
    windMillDetect,
    sprint
} from 'public/scripts/squatDetecotr.js';
import SingleGameResult from "../components/SingleGameResult";
import { useRouter } from "next/router";

export let singleGameMovenetInput = 0;
export let runL = 0;
export let runR = 0;

export default function SingleWebcam({ setIsLoad, startDetect }) {
    const videoRef = useRef();
    const movenetDetector = useRef(null);

    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isModalClose, setIsModalClose] = useState(false);
    const [scores, setScores] = useState(0);

    const animeIdRef = useRef(null);
    let isStart = false;
    let isSquat = false;
    let isJumpingJack = false;
    let isWindMill = false;
    let lastlyIsRun = 0;

    let isOnceCall = 0;

    const router = useRouter();

    useEffect(() => {
		if (isModalClose) {
            setIsCompleteModalOpen(false);
            console.log("끝남 @@@@@@@@@@@@@@");
			router.push("/");
		}
	}, [isModalClose]);


    useEffect(() => {
        setupCamera();  // init cam
        initDetector(); // init detector
        detectSquat();
        return () => {
            console.log('dismounted');
            movenetDetector.current.dispose();
            if (videoRef.current) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            cancelAnimationFrame(animeIdRef.current);
        }
    }, []);

    useEffect(() => {
        if (startDetect) {
            console.log("start detect!");
            // detectSquat();
        }
    }, [startDetect]);

    async function initDetector() {
        await poseDetection
            .createDetector(poseDetection.SupportedModels.MoveNet, {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
            })
            .then((newDetector) => {
                movenetDetector.current = newDetector;
                console.log('detector activated')
                setIsLoad(false);
            });
    }

    // init camera
    async function setupCamera() {

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('No webcam found.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 500,
                height: 1100
            },
        });

        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
                resolve(videoRef.current);
            };
        });

        videoRef.current.play();
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        videoRef.current.width = videoWidth;
        videoRef.current.height = videoHeight;
    }

    async function detectSquat() {      // start pose detection
        if (movenetDetector.current && videoRef.current) {
            try {
                const video = videoRef.current;
                const { videoWidth, videoHeight } = video;
                video.width = videoWidth;
                video.height = videoHeight;

                const pose = await movenetDetector.current.estimatePoses(video);


                if (pose && pose.length > 0) {
                    // 스쿼트
                    isStart = motionStart(pose);
                    if (isStart && (JSON.parse(localStorage.getItem('gameState')) === 5)) {
                        // console.log("squat" + singleGameMovenetInput);
                        singleGameMovenetInput += 1;
                        const targetBtnSS = document.getElementById("btnSingleStart");
                        targetBtnSS.style.display = "none";
                        const targetBtn = document.getElementById("btnSingleOut");
                        targetBtn.style.display = "none";
                    }
                    // 스쿼트
                    isSquat = squatDetect(pose);
                    if (isSquat && (JSON.parse(localStorage.getItem('gameState')) === 2)) {
                        console.log("squat" + singleGameMovenetInput);
                        singleGameMovenetInput += 1;
                    }
                    // 점핑 잭
                    isJumpingJack = jumpingJackDetect(pose);
                    if (isJumpingJack && (JSON.parse(localStorage.getItem('gameState')) === 3)) {
                        console.log("jumpingjack");
                        singleGameMovenetInput += 1;
                    }
                    // 윈드밀
                    isWindMill = windMillDetect(pose);
                    if (isWindMill && (JSON.parse(localStorage.getItem('gameState')) === 4 )) {
                        console.log("WindMill");
                        singleGameMovenetInput += 1;
                    }
                    // 달리기
                    console.log((JSON.parse(localStorage.getItem('gameState'))))
                    const isRun = sprint(pose);
                    // console.log(isRun);
                    if ((JSON.parse(localStorage.getItem('gameState')) === 1) && ( isRun != lastlyIsRun )) {
                        if (isRun === 1) {
                            singleGameMovenetInput += 1;
                            // console.log("runL : ");
                        } else if (isRun === 2) {
                            singleGameMovenetInput += 1;
                            // console.log("runR : ");
                        }
                        lastlyIsRun = isRun;
                        console.log("lastlyIsRun : " + singleGameMovenetInput);
                    }

                    if ((JSON.parse(localStorage.getItem('recordTime')) !== 0) && !isOnceCall) {
                        setScores(Math.floor(localStorage.getItem('recordTime')/10)/100);
                        // console.log(scores);
                        setIsCompleteModalOpen(true);
                    }
                }
            } catch (e) {
                movenetDetector.current.dispose();
                console.log(e);
            }
        }
        animeIdRef.current = requestAnimationFrame(detectSquat);
    }

    const startSingleRoom = () => {
        singleGameMovenetInput += 1;
        const targetBtnSS = document.getElementById("btnSingleStart");
        targetBtnSS.style.display = "none";
        const targetBtn = document.getElementById("btnSingleOut");
        targetBtn.style.display = "none";
    }
    const leaveSingleRoom = () => {
        router.push("/");
    }


    return (
        <>
        <video ref={videoRef} style={{ width: "700px", height: "1000px" }}></video>
        {isCompleteModalOpen && <SingleGameResult scores={scores} setIsModalClose={setIsModalClose}/>}
        <div>
            <button id='btnSingleStart' onClick={startSingleRoom} style={{ position: "absolute", top: "680px", left: "900px", width: "200px", height: "80px", fontSize: "50px", backgroundColor: "skyblue", borderRadius: "20px" }}>시작</button>
            <button id='btnSingleOut' onClick={leaveSingleRoom} style={{ position: "absolute", top: "680px", left: "1490px", width: "200px", height: "80px", fontSize: "50px", backgroundColor: "red", borderRadius: "20px" }}>나가기</button>
        </div>
        </>
    )
}