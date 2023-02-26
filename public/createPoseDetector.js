// import * as poseDetection from '@tensorflow-models/pose-detection';
// import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu'; // cpu 백엔드 추가
// import * as tf from '@tensorflow/tfjs-core';

// export async function createPoseDetector() {
//     // await tf.setBackend('webgl');

//     if (tf.getBackend() === 'webgl' || tf.getBackend() === 'webgpu') {
//         await tf.setBackend('webgl');
//     } else {
//         await tf.setBackend('cpu');
//     }
//     const poseDetector = await poseDetection.createDetector(
//         poseDetection.SupportedModels.MoveNet,
//         { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
//     );
//     return poseDetector;
// }