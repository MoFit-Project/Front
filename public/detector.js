import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu'; // cpu 백엔드 추가
import * as tf from '@tensorflow/tfjs-core';

export function leftCalculateAngle(pointA, pointB, pointC) {
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let degrees = radians * 180 / Math.PI;
    degrees = degrees < 0 ? 360 + degrees : degrees;
    return 360 - degrees;
}

export function rightCalculateAngle(pointA, pointB, pointC) {
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let degrees = radians * 180 / Math.PI;
    degrees = degrees < 0 ? 360 + degrees : degrees;
    return degrees;
}

export function calculateAngle(pointA, pointB, pointC) {
    const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let degrees = radians * 180 / Math.PI;
    degrees = degrees < 0 ? 360 + degrees : degrees;
    return degrees;
}

let detector;
let video;
export async function initDetector(newVideo) {
    //await tf.setBackend('webgl');
    const newDetector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    );

    detector = newDetector;
    video = newVideo;
}



export async function detectSquat() {
    if (detector) {
        try {
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
                const leftElbow = pose[0].keypoints.find((k) => k.name === 'left_elbow');
                const leftShoulder = pose[0].keypoints.find((k) => k.name === 'left_shoulder');
                const leftWrist = pose[0].keypoints.find((k) => k.name === 'left_wrist');

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
            console.log(e);
        }
    }
    requestAnimationFrame(detectSquat);
}