"use client";

import { useEffect, useRef } from "react";
import { decompressFrames, parseGIF, type ParsedFrame } from "gifuct-js";

const HOLD_MS = 1_000;

/**
 * Plays a GIF once, holds the last frame, then starts again.
 * A normal img element cannot pause between loops.
 */
export function PausingGif({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const view = canvas?.getContext("2d");
    if (!canvas || !view) return;

    let cancelled = false;
    let timer = 0;
    const patchCanvas = document.createElement("canvas");
    const patchView = patchCanvas.getContext("2d");
    if (!patchView) return;

    type HeldFrame = {
      disposal: number;
      dims: ParsedFrame["dims"];
      snapshot: ImageData | null;
    };

    function paint(frame: ParsedFrame, held: HeldFrame | null): HeldFrame {
      if (held?.disposal === 2) {
        view.clearRect(
          held.dims.left,
          held.dims.top,
          held.dims.width,
          held.dims.height,
        );
      } else if (held?.disposal === 3 && held.snapshot) {
        view.putImageData(held.snapshot, 0, 0);
      }

      const snapshot =
        frame.disposalType === 3
          ? view.getImageData(0, 0, canvas.width, canvas.height)
          : null;
      const { width, height, left, top } = frame.dims;
      patchCanvas.width = width;
      patchCanvas.height = height;
      const image = patchView.createImageData(width, height);
      image.data.set(frame.patch);
      patchView.putImageData(image, 0, 0);
      view.drawImage(patchCanvas, left, top);

      return { disposal: frame.disposalType, dims: frame.dims, snapshot };
    }

    function step(
      frames: ParsedFrame[],
      index: number,
      held: HeldFrame | null,
    ) {
      if (cancelled) return;
      if (index >= frames.length) {
        timer = window.setTimeout(() => step(frames, 0, null), HOLD_MS);
        return;
      }
      if (index === 0) view.clearRect(0, 0, canvas.width, canvas.height);
      const next = paint(frames[index], index === 0 ? null : held);
      timer = window.setTimeout(
        () => step(frames, index + 1, next),
        Math.max(frames[index].delay, 20),
      );
    }

    void (async () => {
      const response = await fetch(src);
      if (!response.ok || cancelled) return;
      const gif = parseGIF(await response.arrayBuffer());
      if (cancelled) return;
      const frames = decompressFrames(gif, true);
      if (!frames.length) return;
      canvas.width = gif.lsd.width;
      canvas.height = gif.lsd.height;
      step(frames, 0, null);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [src]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
