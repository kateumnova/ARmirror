// Crisp + mirrored camera + overscan via wrapper (hides clamp)

import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
} from "@snap/camera-kit";
import { privacyText } from "./privacy-text.ts";

(async function () {
  try {
    const cameraKit = await bootstrapCameraKit({
      apiToken:
        "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY1ODA1NTEyLCJzdWIiOiIxZGNiNTc5Ny1lMjVlLTQxMzctOTUwMS1iMDVmMTliMTBmMjZ-UFJPRFVDVElPTn42ZWNkNzZiNy0zMWNlLTQ5MGItYWI0YS02ODViNDRiZTdjMmYifQ.W9Bn9zr4Ts933wK59r5d4zOQ5ihsiOg4EhAz0YmdkIE",
    });

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const wrapper = document.getElementById("canvasWrapper") as HTMLElement;

    if (!canvas || !wrapper) {
      throw new Error('Missing <canvas id="canvas"> or #canvasWrapper in index.html.');
    }

    // Use the wrapper's size for the canvas buffer (includes overscan).
    // This ensures Camera Kit renders at the larger size; the wrapper then
    // crops the edges so the clamped strip is not visible.
    const dpr = window.devicePixelRatio || 1;
    const bufferWidth = Math.round(wrapper.clientWidth * dpr);
    const bufferHeight = Math.round(wrapper.clientHeight * dpr);

    canvas.width = bufferWidth;
    canvas.height = bufferHeight;

    // CSS controls visible display size. Do not change .width/.height later.
    // The canvas fills the wrapper; the wrapper is centered and slightly
    // larger than the viewport to hide the right-edge clamp.

    const session = await cameraKit.createSession({ liveRenderTarget: canvas });

    // Keep these as "ideal": Safari can choose the best supported mode.
    const aspect = bufferWidth / bufferHeight;

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        aspectRatio: { ideal: aspect },
        facingMode: "user",
      },
      audio: false,
    });

    // Logs only; it cannot affect video or Camera Kit quality.
    const track = mediaStream.getVideoTracks()[0];
    console.log("Camera settings:", track.getSettings());
    console.log("Canvas buffer:", {
      width: canvas.width,
      height: canvas.height,
      wrapperClientWidth: wrapper.clientWidth,
      wrapperClientHeight: wrapper.clientHeight,
      devicePixelRatio: dpr,
      aspect,
    });

    // Wrap the MediaStream in a CameraKitSource with:
    // - horizontal mirror (camera only),
    // - explicit user camera type for correct aspect/crop handling.
    const source = createMediaStreamSource(mediaStream, {
      transform: Transform2D.MirrorX,
      cameraType: "user",
    });

    await session.setSource(source);
    await session.play();

    // Lens ID and Lens Group ID: My Lenses > Lens Scheduler.
    // First value: Lens ID. Second value: Lens Group ID.
    const lens = await cameraKit.lensRepository.loadLens(
      "16045a59-f6a5-4a13-8164-987a740cd28c", // Lens ID
      "0a6f9d65-7013-4e67-93f8-a06e63203104"  // Lens Group ID
    );

    await session.applyLens(lens);

    console.log("Lens loaded and applied.");
  } catch (error) {
    console.error("Camera Kit startup error:", error);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("helpPopup");
  const btn = document.getElementById("helpButton");
  const close = document.getElementById("closeBtn");

  // Correct syntax: all three elements must exist.
  if (!popup || !btn || !close) return;

  const textDiv = document.querySelector(".popup-text") as HTMLElement | null;

  if (textDiv) {
    textDiv.innerHTML = privacyText;
  }

  const togglePopup = (open: boolean) => {
    popup.classList.toggle("hidden", !open);

    const url = new URL(window.location.href);

    if (open) {
      url.searchParams.set("privacypolicy", "");
    } else {
      url.searchParams.delete("privacypolicy");
    }

    history.pushState({ popup: open }, "", url);
  };

  btn.onclick = () => togglePopup(true);
  close.onclick = () => togglePopup(false);

  popup.onclick = (event) => {
    if (event.target === popup) {
      togglePopup(false);
    }
  };

  if (new URL(window.location.href).searchParams.has("privacypolicy")) {
    togglePopup(true);
  }

  window.onpopstate = () => {
    togglePopup(
      new URL(window.location.href).searchParams.has("privacypolicy")
    );
  };
});
