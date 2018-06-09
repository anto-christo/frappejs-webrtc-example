var desk = (function () {
    'use strict';

    var webrtc = class WebRTC {

        constructor(roomName){
            this.type;
            this.dataChannel;
            this.roomName = roomName;
            this.iceServers = {
                'iceServers': [{
                        'url': 'stun:stun.services.mozilla.com'
                    },
                    {
                        'url': 'stun:stun.l.google.com:19302'
                    }
                ]
            };
            this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);        
        }

        initConnection(roomName){
            this.roomName = roomName;
            this.createDataChannel();
            this.onIceCandidate(this);
            this.setupSocketHandlers(this);
            socket.emit('create or join', this.roomName);
        }

        onIceCandidate(that){
            this.rtcPeerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('candidate', {
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate,
                        room: that.roomName
                    });
                }
            };
        }

        setupSocketHandlers(that){
            socket.on('created',function(){
                that.type = 'host';
            });

            socket.on('joined', function(room) {
                that.type = 'client';
                socket.emit('ready',room);
            });

            socket.on('createOffer',function(room){
                if(that.type=='host'){
                    that.createOffer(that).then(offer => {
                        socket.emit('offer',{room:room, offer:offer});
                    });
                }
            });

            socket.on('sendOffer',function(event) {
                if(that.type=='client'){
                    that.createAnswer(that,event.offer).then(answer => {
                        socket.emit('answer',{room:event.room, answer: answer});
                    });   
                }
            });

            socket.on('sendAnswer', function(answer){
                if(that.type=='host'){
                    that.setHostRemote(answer);
                }
            });

            socket.on('candidate', function (event) {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: event.label,
                    candidate: event.candidate
                });
                that.rtcPeerConnection.addIceCandidate(candidate);
            });
        }

        async createOffer(that) {
            return await this.rtcPeerConnection.createOffer()
            .then(desc => {
                that.rtcPeerConnection.setLocalDescription(desc);
                return desc;
            })
            .catch(e => console.log(e));
        }

        async createAnswer(that,offer) {
            this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        
            return await this.rtcPeerConnection.createAnswer()
                .then(desc => {
                    that.rtcPeerConnection.setLocalDescription(desc);
                    return desc;
                })
                .catch(e => console.log(e));
        }

        setHostRemote(answer){
            this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }

        createDataChannel(){
            this.dataChannel = this.rtcPeerConnection.createDataChannel("myDataChannel");
        
            this.dataChannel.onerror = function (error) {
                console.log("Data Channel Error:", error);
            };
            
            this.dataChannel.onopen = function () {
                console.log("The Data Channel is Open");
            };
            
            this.dataChannel.onclose = function () {
                console.log("The Data Channel is Closed");
            };

            this.setupReceiver();
        }

        setupReceiver(){
            this.rtcPeerConnection.ondatachannel = event => {
                const receiveChannel = event.channel;
                receiveChannel.onmessage = message => this.onDataReceive(message.data);
            };
        }

        sendData(data){
            this.dataChannel.send(data);
        }
    };

    var webrtc$1 = /*#__PURE__*/Object.freeze({
        default: webrtc,
        __moduleExports: webrtc
    });

    var WebRTC = ( webrtc$1 && webrtc ) || webrtc$1;

    var webRTC = new WebRTC();

    var socket$1 = io();
    window.socket = socket$1;

    var message = document.getElementById("message");
    var sendBtn = document.getElementById("send");
    var messageList = document.getElementById("messageList");

    var id = prompt("Enter Name of Room:");
    webRTC.initConnection(id);

    sendBtn.onclick = function(){
        var text = message.value;
        webRTC.sendData(text);
        var div = document.createElement("div");
        div.setAttribute("style","border:0.5px solid grey; margin:1%; padding:1%");
        var data = document.createTextNode("You : "+text);
        div.appendChild(data);
        messageList.appendChild(div);
    };

    webRTC.onDataReceive = data => {
        var div = document.createElement("div");
        div.setAttribute("style","border:0.5px solid grey; margin:1%; padding:1%");
        var data = document.createTextNode("Sender : "+data);
        div.appendChild(data);
        messageList.appendChild(div);
    };

    var src = {

    };

    return src;

}());
//# sourceMappingURL=bundle.js.map
