import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { isRoomHostState } from "../../recoil/states";
// import { motionStart } from "../../recoil/motionStart";
import {
	leftCalculateAngle,
	rightCalculateAngle,
	calculateAngle,
} from "../../../public/detector.js";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import {
	sendSignalThrow,
	sendSignalJumpingJacks,
} from "../openvidu/OpenviduComponent";
// export let isMotionStart = false;
export default function OvVideo({
	streamManager,
	userName,
	session,
	children,
	setIsOpenViduLoaded,
	setIsMovenetLoaded,
	isMoveNetStart,
	setIsMotionStart
}) {
	const videoRef = useRef(null);
	const detectorRef = useRef(null);
	const requestAnimeRef = useRef(null);
	const [isLoaded, setIsLoaded] = useState(false);
	// const [isMotionStart, setIsMotionStart] = useRecoilState(motionStart);
	//const [isRoomHost, setIsRoomHost] = useRecoilState(isRoomHostState);
	//console.log(isRoomHost);
	useEffect(() => {
		if (streamManager && !!videoRef.current) {
			streamManager.addVideoElement(videoRef.current);
			setIsOpenViduLoaded(true);
		}
	}, [streamManager]);

	useEffect(() => {
		if (isMoveNetStart) {
			// detectSquat();
		}
	}, [isMoveNetStart]);

	useEffect(() => {
		if (streamManager) initDetector();

		return () => {
			console.log(requestAnimeRef.current);
			console.log(detectorRef.current);
			if (requestAnimeRef.current && detectorRef.current) {
				console.log(requestAnimeRef.current);
				console.log(detectorRef.current);

				cancelAnimationFrame(requestAnimeRef.current);
				detectorRef.current.dispose();
				setIsLoaded(false);
			}
		};
	}, []);

	useEffect(() => {
		if (isLoaded) {
			if (detectorRef.current && videoRef.current) {
				console.log("detectSquat");
				setIsMovenetLoaded(true);
				detectSquat();
			}
		}
	}, [isLoaded]);

	async function initDetector() {
		//await tf.setBackend('webgl');
		await poseDetection
			.createDetector(poseDetection.SupportedModels.MoveNet, {
				modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
			})
			.then((newDetector) => {
				detectorRef.current = newDetector;
				setIsLoaded(true);
			});
	}

	let isICurrSquartState = false;
	let jumpingJack = false;
	let circleStart = false;
	let run = false;
	async function detectSquat() {
		// let phaserStart111;
		// if (typeof window !== 'undefined') {
		// 	phaserStart111 = JSON.parse(localStorage.getItem('phaserStart'));
		// }
		let phaserStart111 = JSON.parse(localStorage.getItem('phaserStart'));
		// console.log(phaserStart111);
		if (detectorRef.current) {
			try {
				let video = videoRef.current;
				const { videoWidth, videoHeight } = video;
				video.width = videoWidth;
				video.height = videoHeight;

				const pose = await detectorRef.current.estimatePoses(video);
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
						( 
							leftHip &&
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
							if ((JSON.parse(localStorage.getItem('phaserStart')) === 1)) {
								if (session && !isICurrSquartState) {
									console.log("squat");
									sendSignalThrow(session);
								}
							}
							isICurrSquartState = true;
						}
						else if (leftHipAngle > 160 && rightHipAngle > 160) {
							isICurrSquartState = false;
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
							console.log("Jumping Jacks detected!");
							if ((JSON.parse(localStorage.getItem('phaserStart')) === 1)) {
								if (session) {
									sendSignalJumpingJacks(session);
								}
							}
							// console.log(jumpingJack);
						} else if (
							leftShoulderAngle < 30 &&
							rightShoulderAngle < 30 &&
							leftHipAngle < 195 &&
							rightHipAngle < 195 &&
							jumpingJack
						) {
							console.log("Stand detected!");
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

					// 만세
					if (
						pose[0].keypoints[10] &&
						pose[0].keypoints[8] &&
						pose[0].keypoints[6] &&
						pose[0].keypoints[12] &&
						pose[0].keypoints[9] &&
						pose[0].keypoints[7] &&
						pose[0].keypoints[5] &&
						pose[0].keypoints[11] 
					) {
						const rightArmAngle = calculateAngle(
							pose[0].keypoints[10],
							pose[0].keypoints[8],
							pose[0].keypoints[6]
						);
						const leftArmAngle = calculateAngle(
							pose[0].keypoints[9],
							pose[0].keypoints[7],
							pose[0].keypoints[5]
						);
						const leftShoulderAngle = calculateAngle(
							pose[0].keypoints[11],
							pose[0].keypoints[5],
							pose[0].keypoints[7]
						);
						const rightShoulderAngle = calculateAngle(
							pose[0].keypoints[12],
							pose[0].keypoints[6],
							pose[0].keypoints[8]
						);
						
						if (leftArmAngle > 240 &&
							rightArmAngle < 120 &&
							leftShoulderAngle < 240 && 
							rightShoulderAngle > 120
						) {
							
							if((JSON.parse(localStorage.getItem('phaserStart')) === 0)){
								setIsMotionStart(true);
							}
							// setIsMotionStart(true);
							// isMotionStart = true;
							
							// console.log("TRUETRUETRUETRUETRUE   " + isMotionStart);
						} 
						// console.log("left Shoulder   " + leftShoulderAngle);
						// console.log("right Shoulder  " + rightShoulderAngle);
						// console.log("left Arm   " + leftArmAngle);
						// console.log("right Arm   " + rightArmAngle);
						// console.log(circleStart);
						// console.log("@@@@@@@@@@@@@@@@@   " + isMotionStart);
						console.log("@@@@@@111111111@@@@@@" + JSON.parse(localStorage.getItem('phaserStart')));
					}
				}
			} catch (e) {
				detectorRef.current.dispose();
				console.log(e);
			}
		}
		requestAnimeRef.current = requestAnimationFrame(detectSquat);
	}

	return (
		<div className="video-container">
			{/* <span className="user-name">{userName}</span> */}
			<video autoPlay={true} ref={videoRef} style={{width: "500px", height: "800px"}}/>

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
