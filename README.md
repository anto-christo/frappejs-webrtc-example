# frappejs-webrtc-example
Basic WebRTC chat demo built using Frappejs

# Steps to setup
1. Clone the repo.
2. Run `yarn` to install the dependencies.
3. Since WebRTC functions have not been merged in Frappejs, copy/cut-paste `webrtc` and `server` folders in the root of repo to `node_modules/frappejs`.

# Steps to run
1. Run `rollup -c -w`.
2. Run `node server.js`.
3. Open browser and visit `localhost:8000` in two tabs. When asked for room name, enter the same room name for the host-client pair. You can have multiple rooms with host-client pairs.

# Implementation Code
If you don't want to run and just have a look at the implementation. These are the two most important files.

1. https://github.com/anto-christo/frappejs-webrtc-example/blob/master/src/js/index.js
2. https://github.com/anto-christo/frappejs-webrtc-example/blob/master/dist/index.html

