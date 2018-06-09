module.exports = class WebRTC {

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
                console.log('sending ice candidate');
                socket.emit('candidate', {
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                    room: that.roomName
                });
            }
        }
    }

    setupSocketHandlers(that){
        socket.on('created',function(){
            that.type = 'host';
            console.log('Host ready');

        });

        socket.on('joined', function(room) {
            that.type = 'client';
            console.log('Client ready');
            socket.emit('ready',room);
        });

        socket.on('createOffer',function(room){
            if(that.type=='host'){
                that.createOffer(that).then(offer => {
                    console.log(offer);
                    socket.emit('offer',{room:room, offer:offer});
                });
            }
        });

        socket.on('sendOffer',function(event) {
            if(that.type=='client'){
                that.createAnswer(that,event.offer).then(answer => {
                    console.log(answer);
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
        console.log(offer);
        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    
        return await this.rtcPeerConnection.createAnswer()
            .then(desc => {
                that.rtcPeerConnection.setLocalDescription(desc);
                return desc;
            })
            .catch(e => console.log(e));
    }

    setHostRemote(answer){
        console.log(answer);
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
        }
    }

    sendData(data){
        this.dataChannel.send(data);
    }
}