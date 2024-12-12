import React from "react";

const ColorPicker = ({ setColor }) => {
  const colors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 255, 0, 0.5)", "rgba(0, 0, 255, 0.5)"];

  return (
    <div>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setColor(color)}
          style={{
            backgroundColor: color,
            border: "none",
            width: "30px",
            height: "30px",
            margin: "5px",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
