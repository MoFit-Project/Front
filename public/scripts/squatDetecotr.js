import { leftCalculateAngle, rightCalculateAngle, calculateAngle } from "../detector.js"

let isSquat = false;
let returnSquat = false;
export function squatDetect(pose) {

    // console.log('squat ----- ')
    // let isSquat = false;

    const leftHip = pose[0].keypoints.find((k) => k.name === 'left_hip');
    const rightHip = pose[0].keypoints.find((k) => k.name === 'right_hip');
    const leftKnee = pose[0].keypoints.find((k) => k.name === 'left_knee');
    const rightKnee = pose[0].keypoints.find((k) => k.name === 'right_knee');
    const leftAnkle = pose[0].keypoints.find((k) => k.name === 'left_ankle');
    const rightAnkle = pose[0].keypoints.find((k) => k.name === 'right_ankle');


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
        // console.log(leftHipAngle);
        // console.log(rightHipAngle);
        // Detect squat by checking if the average knee angle is below 90 degrees.
        returnSquat = false;
        if (leftHipAngle < 120 && rightHipAngle < 120 ) {
            if (!isSquat) {
                returnSquat = true;
            }
            isSquat = true;
        }
        else if (leftHipAngle > 160 && rightHipAngle > 160) {
            isSquat = false;
        }

        return returnSquat;
    }
};

let jumpingJack = false;
let returnJumpinJack = false;
export function jumpingJackDetect(pose) {
    // console.log('jumping-----')
    if (
        pose[0].keypoints[11] && pose[0].keypoints[5] && pose[0].keypoints[7] &&
        pose[0].keypoints[12] && pose[0].keypoints[6] && pose[0].keypoints[8] &&
        pose[0].keypoints[6] && pose[0].keypoints[12] && pose[0].keypoints[14] &&
        pose[0].keypoints[5] && pose[0].keypoints[11] && pose[0].keypoints[13] &&
        pose[0].keypoints[11].score > 0.6 && pose[0].keypoints[5].score > 0.6 && pose[0].keypoints[7].score > 0.6 &&
        pose[0].keypoints[12].score > 0.6 && pose[0].keypoints[6].score > 0.6 && pose[0].keypoints[8].score > 0.6 &&
        pose[0].keypoints[6].score > 0.6 && pose[0].keypoints[12].score > 0.6 && pose[0].keypoints[14].score > 0.6 &&
        pose[0].keypoints[5].score > 0.6 && pose[0].keypoints[11].score > 0.6 && pose[0].keypoints[13].score > 0.6
    ) {
        const leftShoulderAngle = calculateAngle(pose[0].keypoints[7], pose[0].keypoints[5], pose[0].keypoints[11]);
        const rightShoulderAngle = calculateAngle(pose[0].keypoints[12], pose[0].keypoints[6], pose[0].keypoints[8]);
        const leftHipAngle = calculateAngle(pose[0].keypoints[6], pose[0].keypoints[12], pose[0].keypoints[14]);
        const rightHipAngle = calculateAngle(pose[0].keypoints[13], pose[0].keypoints[11], pose[0].keypoints[5]);
        
        // console.log(leftShoulderAngle);
        // console.log(rightShoulderAngle);
        // console.log(leftHipAngle);
        // console.log(rightHipAngle);

        // Classify "jumping jack" movement based on angles
        returnJumpinJack = false;
        if (jumpingJack === false && leftShoulderAngle > 90 && rightShoulderAngle > 90 && leftHipAngle > 195 && rightHipAngle > 195) {
            
            if (!jumpingJack) {
                returnJumpinJack = true;
            }
            jumpingJack = true

        } else if (leftShoulderAngle < 30 && rightShoulderAngle < 30 && leftHipAngle < 195 && rightHipAngle < 195 && jumpingJack) {
            jumpingJack = false
        }
    }

    return returnJumpinJack;
}

let run = 0;
export function sprint(pose) {
    const leftHip = pose[0].keypoints.find((k) => k.name === 'left_hip');
    const rightHip = pose[0].keypoints.find((k) => k.name === 'right_hip');
    const leftKnee = pose[0].keypoints.find((k) => k.name === 'left_knee');
    const rightKnee = pose[0].keypoints.find((k) => k.name === 'right_knee');
    const leftAnkle = pose[0].keypoints.find((k) => k.name === 'left_ankle');
    const rightAnkle = pose[0].keypoints.find((k) => k.name === 'right_ankle');
    // console.log('spring ------')
    // 제자리 달리기 테스트
    // if (
    //     pose[0].keypoints[10] && pose[0].keypoints[9] && pose[0].keypoints[8] &&
    //     pose[0].keypoints[11] && pose[0].keypoints[12] && pose[0].keypoints[13] &&
    //     pose[0].keypoints[10].score >0.5 && pose[0].keypoints[9].score >0.5 && pose[0].keypoints[8].score >0.5 &&
    //     pose[0].keypoints[11].score >0.5 && pose[0].keypoints[10].score >0.5 && pose[0].keypoints[13].score >0.5
    // ) {
        
    //     const leftHipFoot = calculateAngle(pose[0].keypoints[8], pose[0].keypoints[9], pose[0].keypoints[10]);
    //     const rightHipFoot = calculateAngle(pose[0].keypoints[11], pose[0].keypoints[12], pose[0].keypoints[13]);

    //     // console.log("leftHipFoot   " + leftHipFoot);
    //     console.log(rightHipFoot);

    //     // Classify "jumping jack" movement based on angles
    //     if (leftHipFoot > 220 && rightHipFoot < 210) {
    //         // console.log("제자리뛰기 왼다리");
    //         run = 1;
    //     } else if (rightHipFoot > 220 && leftHipFoot < 210) {
    //         // console.log("제자리뛰기 오른다리");
    //         run = 2;
    //     }
    // }

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
        // console.log(leftHipAngle);
        // console.log(rightHipAngle);
        // Detect squat by checking if the average knee angle is below 90 degrees.
        returnSquat = false;
        if (leftHipAngle < 164 && rightHipAngle > 165) {
            run = 1;
            // console.log(leftHipAngle);
        }
        else if (rightHipAngle < 164 && leftHipAngle > 165 ) {
            run = 2;
        }
    }

    return run

}

let isWindMill = false;
let returnWindMill = false;
export function windMillDetect(pose) {

    if (
        pose[0].keypoints[12] && pose[0].keypoints[14] && pose[0].keypoints[16]
    ) {
        returnWindMill = true;
    }

    return returnWindMill;
}