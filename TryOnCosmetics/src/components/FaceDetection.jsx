import React, { useEffect } from "react";
import * as facemesh from "@tensorflow-models/facemesh";
import * as tf from "@tensorflow/tfjs";

const FaceDetection = ({ videoRef, canvasRef }) => {
  useEffect(() => {
    let model;

    const loadFacemeshModel = async () => {
      // Load the FaceMesh model
      model = await facemesh.load();
      console.log("FaceMesh model loaded:", model);

      const detect = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Use tf.tidy to manage TensorFlow memory
        const predictions = await tf.tidy(() => model.estimateFaces(videoRef.current));

        if (predictions.length > 0) {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // Draw landmarks on the canvas
          predictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh;

            ctx.beginPath();
            keypoints.forEach(([x, y]) => {
              ctx.arc(x, y, 1, 0, 2 * Math.PI);
            });
            ctx.strokeStyle = "green";
            ctx.stroke();
          });
        }
      };

      // Run detection every 100ms
      const intervalId = setInterval(detect, 100);

      // Cleanup interval and model when the component unmounts
      return () => {
        clearInterval(intervalId);
        if (model) model.dispose();
      };
    };

    loadFacemeshModel();

    return () => {
      if (model) model.dispose();
    };
  }, [videoRef, canvasRef]);

  return null;
};

export default FaceDetection;
