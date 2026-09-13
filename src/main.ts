import {bootstrapCameraKit} from "@snap/camera-kit";
import { privacyText } from './privacy-text.ts';

(async function (){
  const cameraKit = await bootstrapCameraKit ({
    // Production token: My Lenses (https://my-lenses.snapchat.com/) > Apps.
    // Replace with the production token from your own profile if needed.
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY1ODA1NTEyLCJzdWIiOiIxZGNiNTc5Ny1lMjVlLTQxMzctOTUwMS1iMDVmMTliMTBmMjZ-UFJPRFVDVElPTn42ZWNkNzZiNy0zMWNlLTQ5MGItYWI0YS02ODViNDRiZTdjMmYifQ.W9Bn9zr4Ts933wK59r5d4zOQ5ihsiOg4EhAz0YmdkIE'
  });

const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
function resizeCanvas() {
  liveRenderTarget.width = window.innerWidth;
  liveRenderTarget.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
const session = await cameraKit.createSession({liveRenderTarget});
const mediaStream = await navigator.mediaDevices.getUserMedia({
 video: {
  facingMode: 'user'
 } 
})



await session.setSource(mediaStream);
await session.play();

// Lens ID and group ID: My Lenses (https://my-lenses.snapchat.com/) > Lens Scheduler.
// First value: Lens ID. Second value: Lens Group ID.
// These IDs may differ between personal profiles and lenses.
const lens = await cameraKit.lensRepository.loadLens('419e266d-7666-4622-af8e-15d392d478d0','4420b795-87ac-48d9-8dad-ad0416ec12c1');
await session.applyLens(lens);

}) ();


document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('helpPopup');
  const btn = document.getElementById('helpButton');
  const close = document.getElementById('closeBtn');

  if (!popup || !btn || !close) return;

  const textDiv = document.querySelector('.popup-text') as HTMLElement;
  if (textDiv) {
    textDiv.innerHTML = privacyText;
  }

  const togglePopup = (open: boolean) => {
    popup.classList.toggle('hidden', !open);
    const url = new URL(window.location.href);
    open ? url.searchParams.set('privacypolicy', '') : url.searchParams.delete('privacypolicy');
    history.pushState({popup: open}, '', url);
  };

  btn.onclick = () => togglePopup(true);
  close.onclick = () => togglePopup(false);
  popup.onclick = e => e.target === popup && togglePopup(false);

  if (new URL(window.location.href).searchParams.has('privacypolicy'))
    togglePopup(true);

  window.onpopstate = () => togglePopup(new URL(window.location.href).searchParams.has('privacypolicy'));
});
