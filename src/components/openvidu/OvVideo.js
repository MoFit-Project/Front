import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
import {
	leftCalculateAngle,
	rightCalculateAngle,
	calculateAngle,
} from "../../../public/detector.js";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-core";

export default function OvVideo({ streamManager, userName }) {
  const videoRef = useRef(null);
  const [detector, setDetector] = useState(null);

  //const [detector, setDetector] = useState(null);
  //const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
  //console.log(isRoomHost);
  useEffect(() => {
    if (streamManager && !!videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);
  useEffect(() => {
    initDetector();
  }, []);
  useEffect(() => {
    if (detector && videoRef.current) {
      //detectSquat();
    }
  }, [detector]);

  async function initDetector() {
    //await tf.setBackend('webgl');
    const newDetector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    );
    setDetector(newDetector);
  }
  let jumpingJack = false;
  let run = false;
  async function detectSquat() {
    if (detector) {
      try {
        let video = videoRef.current;
        const { videoWidth, videoHeight } = video;
        video.width = videoWidth;
        video.height = videoHeight;

        const pose = await detector.estimatePoses(video);
        if (pose && pose.length > 0) {
          const leftHip = pose[0].keypoints.find((k) => k.name === "left_hip");
          const rightHip = pose[0].keypoints.find(
            (k) => k.name === "right_hip"
          );
          const leftKnee = pose[0].keypoints.find(
            (k) => k.name === "left_knee"
          );
          const rightKnee = pose[0].keypoints.find(
            (k) => k.name === "right_knee"
          );
          const leftAnkle = pose[0].keypoints.find(
            (k) => k.name === "left_ankle"
          );
          const rightAnkle = pose[0].keypoints.find(
            (k) => k.name === "right_ankle"
          );
          const leftElbow = pose[0].keypoints.find(
            (k) => k.name === "left_elbow"
          );
          const leftShoulder = pose[0].keypoints.find(
            (k) => k.name === "left_shoulder"
          );
          const leftWrist = pose[0].keypoints.find(
            (k) => k.name === "left_wrist"
          );

          // 스쿼트
          if (
            (leftHip &&
              rightHip &&
              leftKnee &&
              rightKnee &&
              leftHip.score >= 0.7,
            rightHip.score >= 0.7,
            leftKnee >= 0.7,
            rightKnee.score >= 0.7)
          ) {
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

          // 점핑 잭
          if (
            pose[0].keypoints[11] &&
            pose[0].keypoints[5] &&
            pose[0].keypoints[7] &&
            pose[0].keypoints[12] &&
            pose[0].keypoints[6] &&
            pose[0].keypoints[8] &&
            pose[0].keypoints[6] &&
            pose[0].keypoints[12] &&
            pose[0].keypoints[14] &&
            pose[0].keypoints[5] &&
            pose[0].keypoints[11] &&
            pose[0].keypoints[13]
          ) {
            const leftShoulderAngle = calculateAngle(
              pose[0].keypoints[7],
              pose[0].keypoints[5],
              pose[0].keypoints[11]
            );
            const rightShoulderAngle = calculateAngle(
              pose[0].keypoints[12],
              pose[0].keypoints[6],
              pose[0].keypoints[8]
            );
            const leftHipAngle = calculateAngle(
              pose[0].keypoints[6],
              pose[0].keypoints[12],
              pose[0].keypoints[14]
            );
            const rightHipAngle = calculateAngle(
              pose[0].keypoints[13],
              pose[0].keypoints[11],
              pose[0].keypoints[5]
            );
            // console.log("leftS"+leftShoulderAngle)
            // console.log("rightS"+rightShoulderAngle)
            // console.log("leftH"+leftHipAngle)
            // console.log("rightH"+rightHipAngle)

            // Classify "jumping jack" movement based on angles
            if (
              jumpingJack === false &&
              leftShoulderAngle > 90 &&
              rightShoulderAngle > 90 &&
              leftHipAngle > 195 &&
              rightHipAngle > 195
            ) {
              jumpingJack = true;
              console.log('Jumping Jacks detected!');
              // console.log(jumpingJack);
            } else if (
              leftShoulderAngle < 30 &&
              rightShoulderAngle < 30 &&
              leftHipAngle < 195 &&
              rightHipAngle < 195 &&
              jumpingJack
            ) {
              console.log('Stand detected!');
              jumpingJack = false;
            }
          }

          // 제자리 달리기 테스트
        //   if (
        //     pose[0].keypoints[12] &&
        //     pose[0].keypoints[14] &&
        //     pose[0].keypoints[16] &&
        //     pose[0].keypoints[11] &&
        //     pose[0].keypoints[13] &&
        //     pose[0].keypoints[15]
        //   ) {
        //     // const leftShoulderKnee = calculateAngle(pose[0].keypoints[6], pose[0].keypoints[12], pose[0].keypoints[14]);
        //     // const rightShoulderKnee = calculateAngle(pose[0].keypoints[12], pose[0].keypoints[6], pose[0].keypoints[8]);
        //     const leftHipFoot = calculateAngle(
        //       pose[0].keypoints[11],
        //       pose[0].keypoints[13],
        //       pose[0].keypoints[15]
        //     );
        //     const rightHipFoot = calculateAngle(
        //       pose[0].keypoints[16],
        //       pose[0].keypoints[14],
        //       pose[0].keypoints[12]
        //     );
        //     // console.log(rightHipFoot);
        //     // console.log("rightS"+rightShoulderAngle)
        //     // console.log("leftH"+leftHipAngle)
        //     // console.log("rightH"+rightHipAngle)

        //     // Classify "jumping jack" movement based on angles
        //     if (leftHipFoot > 200 && rightHipFoot < 190 && run) {
        //       console.log("제자리뛰기 왼다리");
        //       run = false;
        //     } else if (rightHipFoot > 200 && leftHipFoot < 190 && !run) {
        //       console.log("제자리뛰기 오른다리");
        //       run = true;
        //     }
        //   }
        }
      } catch (e) {
        detector.dispose();
        console.log(e);
      }
    }
    requestAnimationFrame(detectSquat);
  }

  return <video autoPlay={true} ref={videoRef} />;
}
