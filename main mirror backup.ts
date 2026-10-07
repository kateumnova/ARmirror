// Crisp version + mirrored camera + fixed crop (lens text NOT mirrored)

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

    const liveRenderTarget = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;

    if (!liveRenderTarget) {
      throw new Error('Missing <canvas id="canvas"> in index.html.');
    }

    // Retina canvas: set once, before Camera Kit takes ownership.
    const dpr = window.devicePixelRatio || 1;
    liveRenderTarget.width = Math.round(window.innerWidth * dpr);
    liveRenderTarget.height = Math.round(window.innerHeight * dpr);

    // CSS controls display size; do not change .width/.height later.
    liveRenderTarget.style.width = "100vw";
    liveRenderTarget.style.height = "100vh";

    const session = await cameraKit.createSession({ liveRenderTarget });

    // Get camera stream as in your working version.
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user",
      },
      audio: false,
    });

    // Wrap the MediaStream in a CameraKitSource with:
    // - horizontal mirror (camera only),
    // - explicit user camera type for correct aspect/crop.
    const source = createMediaStreamSource(mediaStream, {
      transform: Transform2D.MirrorX,
      cameraType: "user",
    });

    await session.setSource(source);
    await session.play();

    const lens = await cameraKit.lensRepository.loadLens(
      "419e266d-7666-4622-af8e-15d392d478d0",
      "4420b795-87ac-48d9-8dad-ad0416ec12c1"
    );

    await session.applyLens(lens);

    const track = mediaStream.getVideoTracks()[0];
    console.log("Camera settings:", track.getSettings());
    console.log("Canvas buffer:", {
      width: liveRenderTarget.width,
      height: liveRenderTarget.height,
      cssWidth: liveRenderTarget.style.width,
      cssHeight: liveRenderTarget.style.height,
      devicePixelRatio: dpr,
    });

    console.log("Lens loaded and applied.");
  } catch (error) {
    console.error("Camera Kit startup error:", error);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("helpPopup");
  const btn = document.getElementById("helpButton");
  const close = document.getElementById("closeBtn");

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
