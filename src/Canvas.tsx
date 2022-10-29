import React, { useRef, useLayoutEffect } from "react";

type Props = {
  loadedImg?: HTMLImageElement;
  imgUrl: string;
  sizeX: number;
  sizeY: number;
  roundness?: number;
  getCtx: any;
};

const Canvas = React.memo(({ loadedImg, imgUrl, sizeX, sizeY, roundness, getCtx }: Props) => {
  const canvasrRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const calcImgSize = (x: number, y: number) => {
      let imgRatio = x / y;
      let setRatio = sizeX / sizeY;
      let finalWidth, finalHeight;
      if (imgRatio > setRatio) {
        finalWidth = sizeX;
        finalHeight = Math.round(sizeX / imgRatio);
      } else {
        finalWidth = Math.round(sizeY * imgRatio);
        finalHeight = sizeY;
      }
      return [finalWidth, finalHeight];
    };
    const setCanvas = (img: HTMLImageElement) => {
      if (!canvasrRef.current || !ctx) {
        return;
      }
      let imgSize = calcImgSize(img.width, img.height);
      canvasrRef.current.width = imgSize[0];
      canvasrRef.current.height = imgSize[1];
      ctx.drawImage(img, 0, 0, imgSize[0], imgSize[1]);
    };

    let ctx: CanvasRenderingContext2D | null;
    if (canvasrRef.current) {
      ctx = canvasrRef.current.getContext("2d");

      // if (loadedImg) {
      //   setCanvas(loadedImg);
      // } else {
      //   const initialImg = new Image();
      //   initialImg.onload = () => {
      //     setCanvas(initialImg);
      //   };
      //   initialImg.src = imgUrl;
      // }
      getCtx(ctx);
    }
  }, [loadedImg, imgUrl, getCtx, sizeY, sizeX]);

  return <canvas ref={canvasrRef} style={{ borderRadius: roundness }} width={sizeX} height={sizeY} />;
});

export default Canvas;
