"use client";

import { useEffect, useRef } from "react";
import type { RenderTask } from "pdfjs-dist";
import * as pdfjs from "pdfjs-dist";

const PDFViewer = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const renderPDF = async () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const canvasContext = canvas.getContext("2d");
      if (!canvasContext) {
        return;
      }

      try {
        // Set up the worker.
        pdfjs.GlobalWorkerOptions.workerSrc =
          window.location.origin + "/pdf.worker.min.mjs";

        // Load the PDF document.
        const pdf = await pdfjs.getDocument(url).promise;

        // Get the first page.
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Ensure no other render tasks are running.
        if (renderTaskRef.current) {
          await renderTaskRef.current.promise;
        }

        // Render the page into the canvas.
        const renderContext = {
          canvasContext,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;

        if (!isCancelled) {
          console.log("Rendering completed");
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "RenderingCancelledException") {
            console.log("Rendering cancelled.");
          } else {
            console.error("Render error:", error);
          }
        }
      }
    };

    renderPDF();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [url]);
  return <canvas ref={canvasRef} className="max-h-48 w-full" />;
};

export default PDFViewer;
