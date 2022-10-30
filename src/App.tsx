import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import "./App.css";

const initialImg = new Image();
const mask = new Image();
const light = new Image();

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [pos, setPos] = useState<[number, number]>([500, 400]);
  const [dragPos, setDragPos] = useState<[number, number]>([500, 400]);
  const [loads, setLoads] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const videoHandle = useRef(0);
  const posi = useRef([500, 400]);

  const someImg = "https://www.flor.cz/blog/wp-content/uploads/industrialni-portret.jpg";

  const getCtx = (ctx: CanvasRenderingContext2D) => {
    setCtx(ctx);
  };

  useEffect(() => {
    initialImg.onload = () => {
      setLoads(loads + 1);
    };
    initialImg.src = someImg;

    mask.onload = () => {
      setLoads(loads + 1);
    };
    mask.src = "https://i.imgur.com/yOc0YHC.png";

    light.onload = () => {
      setLoads(loads + 1);
    };
    light.src = "https://thumbs.gfycat.com/AchingGargantuanBass.webp";
  }, []);

  function video_load_callback() {
    if (video.current === null) {
      return;
    }
    //video.current.cancelVideoFrameCallback(videoHandle.current);
    video.current.play();
    step();
  }
  function step() {
    if (video.current === null) {
      return;
    }
    console.log(posi);
    ctx?.save();
    ctx?.drawImage(video.current, posi.current[0] - dragPos[0], posi.current[1] - dragPos[1], 1000, 800);
    if (ctx) {
      ctx.globalCompositeOperation = "soft-light";
    }
    ctx?.drawImage(light, 0, 0, 1000, 800);
    if (ctx) {
      ctx.globalCompositeOperation = "destination-atop";
    }
    ctx?.drawImage(mask, 0, 0, 1000, 800);

    videoHandle.current = video.current.requestVideoFrameCallback(step);
    ctx?.restore();
  }

  useEffect(() => {
    step();
  }, [loads]);

  const render = () => {
    ctx?.save();
    ctx?.drawImage(initialImg, pos[0] - dragPos[0], pos[1] - dragPos[1], 1000, 800);
    if (ctx) {
      ctx.globalCompositeOperation = "soft-light";
    }
    ctx?.drawImage(light, 0, 0, 1000, 800);
    if (ctx) {
      ctx.globalCompositeOperation = "destination-atop";
    }
    ctx?.drawImage(mask, 0, 0, 1000, 800);

    ctx?.restore();
  };

  const mouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    setDragPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
  };

  const mouseUp = (e: React.MouseEvent) => {
    setIsMouseDown(false);
  };

  const mouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      setPos([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      posi.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];

      //render();
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
          ctx?.save();
          ctx?.rotate((20 * Math.PI) / 180);
          ctx?.drawImage(initialImg, 554, -446, 400, 300);
          ctx?.restore();
        }}
      >
        rotate
      </button>
      <video onLoadedData={video_load_callback} ref={video} width="320" height="240" controls>
        <source src="./assets/clip.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

export default App;
