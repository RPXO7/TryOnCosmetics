import React, { useRef, useState } from "react";
import CameraFeed from "./components/CameraFeed";
import FaceDetection from "./components/FaceDetection";
import LipstickOverlay from "./components/LipstickOverlay";
import ColorPicker from "./components/ColorPicker";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [color, setColor] = useState("rgba(255, 0, 0, 0.5)");
  const [predictions, setPredictions] = useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Virtual Lipstick Try-On</h1>
      <CameraFeed videoRef={videoRef} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <FaceDetection videoRef={videoRef} canvasRef={canvasRef} />
      <LipstickOverlay predictions={predictions} canvasRef={canvasRef} color={color} />
      <ColorPicker setColor={setColor} />
    </div>
  );
}

export default App;
