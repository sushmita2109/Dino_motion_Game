import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";

let camera;
export function initialPoseDetection(onJumpDetected) {
  const videoElement = document.createElement("video");
  videoElement.style.position = "fixed"; // or "absolute"
  videoElement.style.top = "10px"; // position it nicely on the screen
  videoElement.style.right = "10px";
  videoElement.style.width = "450px";
  videoElement.style.height = "450px";
  videoElement.style.zIndex = "999"; // so it appears above the canvas/game
  document.body.appendChild(videoElement);
  const pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });
  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  pose.onResults((results) => {
    const landmarks = results.poseLandmarks;
    if (!landmarks) return;

    const rightWrist = landmarks[16];
    const rightShoulder = landmarks[12];

    if (rightWrist && rightShoulder) {
      if (rightWrist.y < rightShoulder.y - 0.1) {
        onJumpDetected(landmarks); // Pass landmarks!
      }
    }
  });

  camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}
