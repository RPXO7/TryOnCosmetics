// import React, { useEffect, useRef, useState } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import { Camera } from "@mediapipe/camera_utils";

// const LipstickApplication = ({ productColors }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const faceMeshInstance = useRef(null); // Persist FaceMesh instance
//   const [selectedColor, setSelectedColor] = useState("#FF0000"); // Default lipstick color

//   useEffect(() => {
//     const initializeFaceMesh = async () => {
//       try {
//         const faceMesh = new FaceMesh({
//           locateFile: (file) =>
//             `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//         });
      
//         faceMesh.setOptions({
//           maxNumFaces: 1,
//           refineLandmarks: true,
//           minDetectionConfidence: 0.5,
//           minTrackingConfidence: 0.5,
//         });
      
//         faceMesh.onResults(processFaceMeshResults);
        
//         faceMeshInstance.current = faceMesh;
//       } catch (error) {
//         console.error("Error initializing FaceMesh:", error);
//       }
        
//       const camera = new Camera(videoRef.current, {
//         onFrame: async () => {
//           if (faceMeshInstance.current) {
//             await faceMeshInstance.current.send({ image: videoRef.current });
//           }
//         },
//         width: 640,
//         height: 480,
//       });

//       camera.start();
//     };

//     const processFaceMeshResults = (results) => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;

//       // Draw video frame
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       if (results.multiFaceLandmarks) {
//         results.multiFaceLandmarks.forEach((landmarks) => {
//           // Lip landmark indices (outer and inner lips)
//           const lipIndices = [
//             61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181, 84,
//             17, 314, 405, 321, 375, 307, 306, 291,
//           ];

//           ctx.beginPath();
//           ctx.fillStyle = selectedColor; // Use selected color for lips
//           ctx.globalAlpha = 0.6; // Transparency

//           lipIndices.forEach((index, i) => {
//             const x = landmarks[index].x * canvas.width;
//             const y = landmarks[index].y * canvas.height;

//             if (i === 0) ctx.moveTo(x, y);
//             else ctx.lineTo(x, y);
//           });

//           ctx.closePath();
//           ctx.fill();
//         });
//       }
//     };

//     initializeFaceMesh();

//     return () => {
//       if (faceMeshInstance.current) {
//         faceMeshInstance.current.close();
//         faceMeshInstance.current = null;
//       }
//     };
//   }, []); // Initialize once

//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//   };

//   return (
//     <div>
//       <h1>Lipstick Try-On App</h1>
//       {/* Predefined Colors */}
//       <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//         {(productColors || ["#FF0000", "#FF5733", "#C70039", "#900C3F", "#581845"]).map((color) => (
//           <div
//             key={color}
//             onClick={() => handleColorChange(color)}
//             style={{
//               width: "30px",
//               height: "30px",
//               backgroundColor: color,
//               borderRadius: "50%",
//               border: color === selectedColor ? "2px solid black" : "none",
//               cursor: "pointer",
//             }}
//           ></div>
//         ))}
//       </div>
//       {/* Video and Canvas */}
//       <div style={{ position: "relative", width: "640px", height: "480px" }}>
//         <video ref={videoRef} style={{ display: "none" }}></video>
//         <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
//       </div>
//     </div>
//   );
// };

// export default LipstickApplication;



import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const LipstickApplication = ({ productColors }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#FF0000"); // Default color

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // For better lip detection
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const processResults = (results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw the video frame.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      // Lip landmark indices (outer and inner lips).
      const lipIndices = [
        61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181,
        84, 17, 314, 405, 321, 375, 307, 306, 291,
      ];

      if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          ctx.beginPath();
          ctx.fillStyle = selectedColor;
          ctx.globalAlpha = 0.6; // Adjust transparency

          lipIndices.forEach((index, i) => {
            const x = landmarks[index].x * canvas.width;
            const y = landmarks[index].y * canvas.height;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });

          ctx.closePath();
          ctx.fill();
        });
      }
    };

    faceMesh.onResults(processResults);

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
  }, [selectedColor]); // Update only when the color changes

  return (
    <div>
      <h1>Lipstick Try-On App</h1>
      {/* Predefined Colors */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {(productColors || ["#FF0000", "#FF5733", "#C70039", "#900C3F", "#581845"]).map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: color,
              borderRadius: "50%",
              border: color === selectedColor ? "2px solid black" : "none",
              cursor: "pointer",
            }}
          ></div>
        ))}
      </div>
      {/* Video and Canvas */}
      <div style={{ position: "relative", width: "640px", height: "480px" }}>
        <video ref={videoRef} style={{ display: "none" }}></video>
        <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
      </div>
    </div>
  );
};

export default LipstickApplication;



// import { useEffect, useRef, useState } from "react";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import { Camera } from "@mediapipe/camera_utils";

// const LipstickApplication = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [selectedColor, setSelectedColor] = useState("#FF0000"); // Default lipstick color

//   useEffect(() => {
//     const faceMesh = new FaceMesh({
//       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//     });

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true, // Enables detection of lips and eyes.
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMesh.onResults((results) => {
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;

//       // Draw the video frame.
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

//       // Get landmarks for the lips.
//       if (results.multiFaceLandmarks) {
//         results.multiFaceLandmarks.forEach((landmarks) => {
//           // Define the lip indices (outer and inner lips).
//           const lipIndices = [
//             61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 146, 91, 181,
//             84, 17, 314, 405, 321, 375, 307, 306, 291,
//           ];

//           // Start drawing the lips with the selected color.
//           ctx.beginPath();
//           ctx.fillStyle = selectedColor;
//           ctx.globalAlpha = 0.6; // Transparency for a more realistic look.

//           lipIndices.forEach((index, i) => {
//             const x = landmarks[index].x * canvas.width;
//             const y = landmarks[index].y * canvas.height;

//             if (i === 0) {
//               ctx.moveTo(x, y);
//             } else {
//               ctx.lineTo(x, y);
//             }
//           });

//           ctx.closePath();
//           ctx.fill();
//         });
//       }
//     });

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         await faceMesh.send({ image: videoRef.current });
//       },
//       width: 640,
//       height: 480,
//     });

//     camera.start();

//     return () => {
//       camera.stop();
//       faceMesh.close();
//     };
//   }, [selectedColor]);

//   return (
//     <div>
//       <h1>Lipstick Try-On App</h1>
//       <div>
//         <label>Select Lipstick Color: </label>
//         <input
//           type="color"
//           value={selectedColor}
//           onChange={(e) => setSelectedColor(e.target.value)}
//         />
//       </div>
//       <video ref={videoRef} style={{ display: "none" }}></video>
//       <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
//     </div>
//   );
// };

// export default LipstickApplication;
