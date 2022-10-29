import React, { useState } from "react";
import Canvas from "./Canvas";
import "./App.css";

const someImg = "https://www.flor.cz/blog/wp-content/uploads/industrialni-portret.jpg";
const initialImg = new Image();
initialImg.src = someImg;

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const getCtx = (ctx: CanvasRenderingContext2D) => {
    setCtx(ctx);
  };

  const mouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
  };

  const mouseUp = (e: React.MouseEvent) => {
    setIsMouseDown(false);
    setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
  };

  const mouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      console.log(pos);
    }
  };

  return (
    <div className="App">
      <div id="root">
        <div id="mouseCatcher" onMouseMove={mouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
        <Canvas imgUrl={someImg} sizeX={1200} sizeY={800} roundness={3} getCtx={getCtx}></Canvas>
      </div>
      <button
        onClick={() => {
          console.log("tes");
          ctx?.rotate((20 * Math.PI) / 180);
          ctx?.drawImage(initialImg, 554, -446, 400, 300);
        }}
      >
        rotate
      </button>
    </div>
  );
}

export default App;
