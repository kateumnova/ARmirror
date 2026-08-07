# AR Mirror
AR Mirror is an interactive browser-based augmented reality artwork created for non-commercial artistic purposes.
The artwork uses a live camera feed to create a mirror-like AR experience in which a custom Lens is applied to the viewer in real time.

## Materials and Technologies
- Snapchat Camera Kit Web SDK.
- TypeScript.
- Vite.
- HTML and CSS.
- A webcam or front-facing camera.
- Browser-based real-time video rendering.
- Custom AR Lens.


## Camera Kit
Snap Camera Kit is used to run the AR Lens in a web browser and apply it to the live camera feed.
Camera Kit documentation:
https://developers.snap.com/camera-kit/

Camera Kit Web documentation:
https://developers.snap.com/camera-kit/integrate-sdk/web/guides/camera-kit-web-for-beginners

## Lens Studio
Lens Studio is used to create and publish the custom AR Lens.
Lens Studio:
https://ar.snap.com/lens-studio


## API Token
A production Camera Kit API token can be obtained from:
https://my-lenses.snapchat.com/ → apps

The token is used to initialize Camera Kit in  src/main.ts .
Do not publish personal API tokens in a public repository. Each developer should use a token belonging to their own Snapchat Camera Kit application.
Lens ID and Lens Group ID
The Lens ID and Lens Group ID can be obtained from:
https://my-lenses.snapchat.com/ → Lens Scheduler

The first value used by  loadLens()  is the Lens ID. The second value is the Lens Group ID.
These values depend on the developer’s Snapchat profile, application, Lens, and Lens Group.
Tutorial Reference
The web AR implementation follows methods demonstrated in the JoystickLab tutorial:
“How to build a Web AR app using Snap Camera Kit’s Free SDK”
https://www.youtube.com/watch?v=uHA31ta9jyU
The project also follows the general integration methods described in Snapchat’s Camera Kit documentation.



