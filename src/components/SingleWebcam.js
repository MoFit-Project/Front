import { useRef, useEffect, useState } from 'react';
import {
    leftCalculateAngle,
    rightCalculateAngle,
    calculateAngle,
} from "../../public/detector.js";
import * as poseDetection from '@tensorflow-models/pose-detection';
import {
    squatDetect,
    jumpingJackDetect,
    sprint
} from 'public/scripts/squatDetecotr.js';


export default function SingleWebcam({ setIsLoad, startDetect }) {
    const videoRef = useRef();
    const movenetDetector = useRef(null);

    const animeIdRef = useRef(null);
    let isSquat = false;
    let isJumpingJack = false;
    let isRun = false;


    useEffect(() => {
        setupCamera();  // init cam
        initDetector(); // init detector

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
            detectSquat();
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
                    isSquat = squatDetect(pose);
                    if (isSquat) {
                        console.log("squat");
                    }
                    // // 점핑 잭
                    // isJumpingJack = jumpingJackDetect(pose);
                    // if (isJumpingJack) {
                    //     console.log("jumpingjack");
                    // }
                    // isRun = sprint(pose);
                    // if (isRun) {
                    //     console.log("run");
                    // }
                }
            } catch (e) {
                movenetDetector.current.dispose();
                console.log(e);
            }
        }
        animeIdRef.current = requestAnimationFrame(detectSquat);
    }

    return (
        <video ref={videoRef} style={{ width: "700px", height: "1000px" }}></video>
        
    )
}