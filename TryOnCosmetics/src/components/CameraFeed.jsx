import React, { useEffect, useRef } from "react";

const CameraFeed = ({ videoRef }) => {
  useEffect(() => {
    // Request access to the user's camera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error("Error accessing camera: ", err));
  }, []);

  return <video ref={videoRef} style={{ width: "100%", height: "auto" }} />;
};

export default CameraFeed;
