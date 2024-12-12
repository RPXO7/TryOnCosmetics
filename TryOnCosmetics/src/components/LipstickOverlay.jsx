import React, { useEffect } from "react";

const LipstickOverlay = ({ predictions, canvasRef, color }) => {
  useEffect(() => {
    if (predictions && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      predictions.forEach((prediction) => {
        const lipUpper = prediction.scaledMesh.slice(61, 78);
        const lipLower = prediction.scaledMesh.slice(78, 95);

        ctx.beginPath();
        lipUpper.forEach(([x, y]) => ctx.lineTo(x, y));
        lipLower.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
      });
    }
  }, [predictions, canvasRef, color]);

  return null;
};

export default LipstickOverlay;
