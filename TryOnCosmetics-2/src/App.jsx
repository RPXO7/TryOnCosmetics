import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const LipstickApplication = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#FF0000"); // Default lipstick color

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // Enables detection of lips and eyes.
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw the video frame.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      // Get landmarks for the lips.
      if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          // Define the lip indices (outer and inner lips).
          const lipIndices = [
            61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181,
            84, 17, 314, 405, 321, 375, 307, 306, 291,
          ];

          // Start drawing the lips with the selected color.
          ctx.beginPath();
          ctx.fillStyle = selectedColor;
          ctx.globalAlpha = 0.6; // Transparency for a more realistic look.

          lipIndices.forEach((index, i) => {
            const x = landmarks[index].x * canvas.width;
            const y = landmarks[index].y * canvas.height;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });

          ctx.closePath();
          ctx.fill();
        });
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, [selectedColor]);

  return (
    <div>
      <h1>Lipstick Try-On App</h1>
      <div>
        <label>Select Lipstick Color: </label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </div>
      <video ref={videoRef} style={{ display: "none" }}></video>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
    </div>
  );
};

export default LipstickApplication;
