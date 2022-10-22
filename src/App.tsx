import React, { useState } from "react";
import Canvas from "./Canvas";
import "./App.css";

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const getCtx = (ctx: CanvasRenderingContext2D) => {
    setCtx(ctx);
  };

  return (
    <div className="App">
      <Canvas
        imgUrl="https://www.flor.cz/blog/wp-content/uploads/industrialni-portret.jpg"
        sizeX={1200}
        sizeY={800}
        roundness={3}
        getCtx={getCtx}
      ></Canvas>
    </div>
  );
}

export default App;
