import React, { useState, useEffect, useRef } from "react";
import Canvas from "./Canvas";
import "./App.css";
import uluwatu from "./imgs/baseImg.jpg";
import mask from "./imgs/mask2.png";

const baseImg = new Image();
const maskImg = new Image();
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight - 200;

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [error, setError] = useState("");
  const [loads, setLoads] = useState(0);
  const isMouseDown = useRef(false);
  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);
  const videoHandle = useRef(0);
  const playing = useRef(false);
  const currentPos = useRef([0, 0]);
  const dragPos = useRef([0, 0]);

  const getCtx = (ctx: CanvasRenderingContext2D) => {
    setCtx(ctx);
  };

  useEffect(() => {
    baseImg.onload = () => {
      setLoads(loads + 1);
    };
    baseImg.src = uluwatu;

    maskImg.onload = () => {
      setLoads(loads + 1);
    };
    maskImg.src = mask;
  }, []);

  function video_load_callback() {
    setLoads(loads + 1);
  }

  function play(video: HTMLVideoElement) {
    if (playing.current) {
      video1.current && video1.current.pause();
      video2.current && video2.current.pause();
      playing.current = false;
      return;
    }
    video.cancelVideoFrameCallback(videoHandle.current);
    video.play();
    playing.current = true;
    console.log(video);
    renderStep(video);
  }

  function renderStep(video: HTMLVideoElement) {
    ctx?.save();
    ctx?.drawImage(baseImg, 0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);

    if (ctx) {
      ctx.globalCompositeOperation = "hard-light";
    }
    ctx?.drawImage(
      video,
      currentPos.current[0] - dragPos.current[0] + 300,
      currentPos.current[1] - dragPos.current[1] + 160,
      ctx.canvas.offsetWidth * 0.6,
      ctx.canvas.offsetHeight * 0.8
    );
    if (ctx) {
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = 0.9;
    }
    ctx?.drawImage(
      video,
      currentPos.current[0] - dragPos.current[0] + 300,
      currentPos.current[1] - dragPos.current[1] + 160,
      ctx.canvas.offsetWidth * 0.6,
      ctx.canvas.offsetHeight * 0.8
    );
    if (ctx) {
      ctx.globalCompositeOperation = "destination-atop";
    }
    ctx?.drawImage(maskImg, 0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
    try {
      videoHandle.current = video.requestVideoFrameCallback(() => {
        renderStep(video);
      });
    } catch {
      setError("Error: your browser doesn't support requestVideoFrameCallback");
      return;
    }
    ctx?.restore();
  }

  const mouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    currentPos.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    dragPos.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const mouseUp = (e: React.MouseEvent) => {
    isMouseDown.current = false;
  };

  const mouseMove = (e: React.MouseEvent) => {
    if (isMouseDown.current) {
      currentPos.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    }
  };

  return (
    <div className="App">
      <div id="root">
        <div id="mouseCatcher" onMouseMove={mouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp}></div>
        <img src={uluwatu} alt="" />
        <Canvas loadedImg={baseImg} sizeX={screenWidth} sizeY={screenHeight} roundness={6} getCtx={getCtx}></Canvas>
      </div>
      <br />
      <video
        onLoadedData={video_load_callback}
        ref={video1}
        width="60"
        height="40"
        onClick={() => video1.current && play(video1.current)}
      >
        <source src="./assets/clip.mp4" type="video/mp4" />
      </video>
      <video
        onLoadedData={video_load_callback}
        ref={video2}
        width="60"
        height="40"
        onClick={() => video2.current && play(video2.current)}
      >
        <source src="./assets/illusion.mp4" type="video/mp4" />
      </video>
      {error && <p>{error}</p>}
      {loads < 2 && <p>loading..</p>}
    </div>
  );
}

export default App;
