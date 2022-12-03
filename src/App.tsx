import React, { useState, useEffect, useCallback, useRef } from "react";
import HTMLImageElement from "react";
import Canvas from "./Canvas";
import "./App.css";

const scale = window.innerWidth > window.innerHeight ? 1 : 2.2;

const baseImg = new Image();
const maskImg = new Image();

let currentPos = [0, 0];
let dragPos = [0, 0];
let isMouseDown = false;

const mouseDown = (e: React.MouseEvent) => {
  isMouseDown = true;
  currentPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  dragPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
};

const mouseUp = (e: React.MouseEvent) => {
  isMouseDown = false;
};

const mouseMove = (e: React.MouseEvent) => {
  if (isMouseDown) {
    currentPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  }
};

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [error, setError] = useState("");
  const [loadCounter, setLoadCounter] = useState(0);
  const [canvasImage, setCanvasImage] = useState<HTMLImageElement>(new Image());
  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);
  const videoHandle = useRef(0);
  const isVideoPlaying = useRef(false);

  useEffect(() => {
    baseImg.onload = () => {
      loadIncrement();
      // canvas will re-render when base image is loaded
      setCanvasImage(baseImg);
    };
    baseImg.src = "./assets/baseImg.jpg";
    maskImg.onload = () => {
      loadIncrement();
    };
    maskImg.src = "./assets/mask2.png";
  }, []);

  // if this callback would't be memoized, canvas component would re-render everytime
  const getCtx = useCallback((ctx: CanvasRenderingContext2D | null) => {
    setCtx(ctx);
  }, []);

  function loadIncrement() {
    setLoadCounter((loadCounter) => loadCounter + 1);
  }

  function play(video: HTMLVideoElement) {
    if (isVideoPlaying.current) {
      video1.current && video1.current.pause();
      video2.current && video2.current.pause();
      isVideoPlaying.current = false;
      return;
    }
    video.play();
    isVideoPlaying.current = true;
    renderStep(video);
  }

  function renderStep(video: HTMLVideoElement) {
    const vRatio = video.videoWidth / video.videoHeight;

    ctx?.save();
    ctx?.drawImage(baseImg, 0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);

    if (ctx) {
      ctx.globalCompositeOperation = "hard-light";
    }
    ctx?.drawImage(
      video,
      currentPos[0] - dragPos[0] + ctx.canvas.offsetWidth / 4,
      currentPos[1] - dragPos[1] + ctx.canvas.offsetHeight / 3.5,
      ctx.canvas.offsetHeight * 0.666 * vRatio,
      ctx.canvas.offsetHeight * 0.666
    );
    if (ctx) {
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.9;
    }
    ctx?.drawImage(
      video,
      currentPos[0] - dragPos[0] + ctx.canvas.offsetWidth / 4,
      currentPos[1] - dragPos[1] + ctx.canvas.offsetHeight / 3.5,
      ctx.canvas.offsetHeight * 0.666 * vRatio,
      ctx.canvas.offsetHeight * 0.666
    );
    if (ctx) {
      ctx.globalCompositeOperation = "destination-atop";
    }
    ctx?.drawImage(maskImg, 0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
    ctx?.restore();
    try {
      // requestVideoFrameCallback runs when a next frame is rendered
      videoHandle.current = video.requestVideoFrameCallback(() => {
        renderStep(video);
      });
    } catch {
      setError("Error: your browser doesn't support requestVideoFrameCallback => no video mapping :(");
      return;
    }
  }

  return (
    <div className="App">
      <div id="frame">
        <div id="controls">
          <div>Click on the thumbnail to play / pause video: </div>
          <video
            onCanPlay={loadIncrement}
            ref={video1}
            height="50"
            onClick={() => video1.current && play(video1.current)}
          >
            <source src="https://www.flor.cz/videomapping/assets/clip.mp4" type="video/mp4" />
          </video>
          <video
            onCanPlay={loadIncrement}
            ref={video2}
            height="50"
            onClick={() => video2.current && play(video2.current)}
          >
            <source src="https://www.flor.cz/videomapping/assets/illusion.mp4" type="video/mp4" />
          </video>
          <div>Then you can drag & move video within a tower.</div>
        </div>
        <div id="mouseCatcher" onMouseMove={mouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
        <img src={baseImg.src} alt="" />
        <Canvas
          loadedImg={canvasImage}
          sizeX={window.innerWidth * scale}
          sizeY={window.innerHeight - window.innerHeight / 8}
          roundness={6}
          getCtx={getCtx}
        ></Canvas>
      </div>

      {error && <p>{error}</p>}
      {loadCounter < 4 && <p>loading.. </p>}
    </div>
  );
}

export default App;
