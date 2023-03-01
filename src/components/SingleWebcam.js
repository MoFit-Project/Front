import { useRef, useEffect, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu'; // cpu 백엔드 추가
import * as tf from '@tensorflow/tfjs-core';

export default function SingleWebcam() {
    const videoRef = useRef();
    const [detector, setDetector] = useState(null);

    async function runSquatDetector() {
        // // await tf.setBackend('webgl');
        // console.log(tf.getBackend());
        // if (tf.getBackend() === 'webgl' || tf.getBackend() === 'webgpu') {
        //     console.log("webgl사용.")
        //     await tf.setBackend('webgl');
        // } else {
        //     console.log("cpu 사용.")
        //     await tf.setBackend('cpu');
        // }
        await tf.setBackend('webgl');
        const model = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        setDetector(model);
    }

    function leftCalculateAngle(pointA, pointB, pointC) {
        const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
        let degrees = radians * 180 / Math.PI;
        degrees = degrees < 0 ? 360 + degrees : degrees;
        return 360 - degrees;
    }

    function rightCalculateAngle(pointA, pointB, pointC) {
        const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
        let degrees = radians * 180 / Math.PI;
        degrees = degrees < 0 ? 360 + degrees : degrees;
        return degrees;
    }

    function calculateAngle(pointA, pointB, pointC) {
        const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
        let degrees = radians * 180 / Math.PI;
        degrees = degrees < 0 ? 360 + degrees : degrees;
        return degrees;
    }

    async function setupCamera() {

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('No webcam found.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 640,
                height: 700
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

    let jumpingJack = false;
    let run = false;
    async function detectSquat() {

        if (detector && videoRef.current.readyState === 4) {
            try {
                const video = videoRef.current;
                const { videoWidth, videoHeight } = video;
                video.width = videoWidth;
                video.height = videoHeight;

                const pose = await detector.estimatePoses(video);

                if (pose && pose.length > 0) {
                    const leftHip = pose[0].keypoints.find((k) => k.name === 'left_hip');
                    const rightHip = pose[0].keypoints.find((k) => k.name === 'right_hip');
                    const leftKnee = pose[0].keypoints.find((k) => k.name === 'left_knee');
                    const rightKnee = pose[0].keypoints.find((k) => k.name === 'right_knee');
                    const leftAnkle = pose[0].keypoints.find((k) => k.name === 'left_ankle');
                    const rightAnkle = pose[0].keypoints.find((k) => k.name === 'right_ankle');
                    // const leftElbow = pose[0].keypoints.find((k) => k.name === 'left_elbow');
                    // const leftShoulder = pose[0].keypoints.find((k) => k.name === 'left_shoulder');
                    // const leftWrist = pose[0].keypoints.find((k) => k.name === 'left_wrist');

                    // 점핑 잭
                    if (
                        pose[0].keypoints[11] && pose[0].keypoints[5] && pose[0].keypoints[7] &&
                        pose[0].keypoints[12] && pose[0].keypoints[6] && pose[0].keypoints[8] &&
                        pose[0].keypoints[6] && pose[0].keypoints[12] && pose[0].keypoints[14] &&
                        pose[0].keypoints[5] && pose[0].keypoints[11] && pose[0].keypoints[13]
                    ) {
                        const leftShoulderAngle = calculateAngle(pose[0].keypoints[7], pose[0].keypoints[5], pose[0].keypoints[11]);
                        const rightShoulderAngle = calculateAngle(pose[0].keypoints[12], pose[0].keypoints[6], pose[0].keypoints[8]);
                        const leftHipAngle = calculateAngle(pose[0].keypoints[6], pose[0].keypoints[12], pose[0].keypoints[14]);
                        const rightHipAngle = calculateAngle(pose[0].keypoints[13], pose[0].keypoints[11], pose[0].keypoints[5]);
                        // console.log("leftS"+leftShoulderAngle)
                        // console.log("rightS"+rightShoulderAngle)
                        // console.log("leftH"+leftHipAngle)
                        // console.log("rightH"+rightHipAngle)

                        // Classify "jumping jack" movement based on angles
                        if (jumpingJack === false && leftShoulderAngle > 90 && rightShoulderAngle > 90 && leftHipAngle > 195 && rightHipAngle > 195) {
                            jumpingJack = true
                            // console.log('Jumping Jacks detected!');
                            // console.log(jumpingJack);

                        } else if (leftShoulderAngle < 30 && rightShoulderAngle < 30 && leftHipAngle < 195 && rightHipAngle < 195 && jumpingJack) {
                            // console.log('Stand detected!');
                            jumpingJack = false
                        }
                    }


                    // 제자리 달리기 테스트
                    if (
                        pose[0].keypoints[12] && pose[0].keypoints[14] && pose[0].keypoints[16] &&
                        pose[0].keypoints[11] && pose[0].keypoints[13] && pose[0].keypoints[15]
                    ) {
                        // const leftShoulderKnee = calculateAngle(pose[0].keypoints[6], pose[0].keypoints[12], pose[0].keypoints[14]);
                        // const rightShoulderKnee = calculateAngle(pose[0].keypoints[12], pose[0].keypoints[6], pose[0].keypoints[8]);
                        const leftHipFoot = calculateAngle(pose[0].keypoints[11], pose[0].keypoints[13], pose[0].keypoints[15]);
                        const rightHipFoot = calculateAngle(pose[0].keypoints[16], pose[0].keypoints[14], pose[0].keypoints[12]);
                        // console.log(rightHipFoot);
                        // console.log("rightS"+rightShoulderAngle)
                        // console.log("leftH"+leftHipAngle)
                        // console.log("rightH"+rightHipAngle)

                        // Classify "jumping jack" movement based on angles
                        if (leftHipFoot > 200 && rightHipFoot < 190 && run) {
                            console.log("제자리뛰기 왼다리");
                            run = false;
                        } else if (rightHipFoot > 200 && leftHipFoot < 190 && !run) {
                            console.log("제자리뛰기 오른다리");
                            run = true;
                        }
                    }




                    if (leftHip && rightHip && leftKnee && rightKnee &&
                        leftHip.score >= 0.7, rightHip.score >= 0.7, leftKnee >= 0.7, rightKnee.score >= 0.7) {
                        const leftHipAngle = leftCalculateAngle(
                            leftHip,
                            leftKnee,
                            leftAnkle
                        );

                        // Calculate the angle between the right hip and right knee.
                        const rightHipAngle = rightCalculateAngle(
                            rightHip,
                            rightKnee,
                            rightAnkle
                        );

                        // Detect squat by checking if the average knee angle is below 90 degrees.
                        if (leftHipAngle < 120 && rightHipAngle < 120) {
                            console.log("squat");
                        }
                    }
                }
            } catch (e) {
                detector.dispose();
                setDetector(null);
                console.log(e);
            }
        }
        requestAnimationFrame(detectSquat);
    }

    useEffect(() => {
        setupCamera();
        runSquatDetector();
    }, []);

    useEffect(() => {
        console.log(detector)
        console.log(videoRef.current.readyState)

        if (detector) {
            detectSquat();
        }
    }, [detector]);

    return (
        <video ref={videoRef} style={{ width: 600, height: 700 }}></video>
    )
}