import { leftCalculateAngle, rightCalculateAngle, calculateAngle } from "../detector.js"

export function squatDetect(pose) {

    console.log('squat ----- ')
    let isSquat = false;

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
        console.log(leftHipAngle)
        console.log(rightHipAngle);
        // Detect squat by checking if the average knee angle is below 90 degrees.
        if (leftHipAngle < 120 && rightHipAngle < 120) {
            isSquat = true;
        }

        return isSquat;
    }
};

export function jumpingJackDetect(pose) {
    console.log('jumping-----')
    let jumpingJack = false;
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
        
        console.log(leftShoulderAngle)
        console.log(rightShoulderAngle);
        console.log(leftHipAngle);
        console.log(rightHipAngle);

        // Classify "jumping jack" movement based on angles
        if (jumpingJack === false && leftShoulderAngle > 90 && rightShoulderAngle > 90 && leftHipAngle > 195 && rightHipAngle > 195) {
            jumpingJack = true
           

        } else if (leftShoulderAngle < 30 && rightShoulderAngle < 30 && leftHipAngle < 195 && rightHipAngle < 195 && jumpingJack) {
            jumpingJack = false
        }
    }

    return jumpingJack;
}

export function sprint(pose) {
    console.log('spring ------')
    let run = false;
    // 제자리 달리기 테스트
    if (
        pose[0].keypoints[12] && pose[0].keypoints[14] && pose[0].keypoints[16] &&
        pose[0].keypoints[11] && pose[0].keypoints[13] && pose[0].keypoints[15]
    ) {
        
        const leftHipFoot = calculateAngle(pose[0].keypoints[11], pose[0].keypoints[13], pose[0].keypoints[15]);
        const rightHipFoot = calculateAngle(pose[0].keypoints[16], pose[0].keypoints[14], pose[0].keypoints[12]);

        console.log(leftHipFoot)
        console.log(rightHipFoot);

        // Classify "jumping jack" movement based on angles
        if (leftHipFoot > 200 && rightHipFoot < 190 && run) {
            console.log("제자리뛰기 왼다리");
            run = false;
        } else if (rightHipFoot > 200 && leftHipFoot < 190 && !run) {
            console.log("제자리뛰기 오른다리");
            run = true;
        }
    }

    return run

}