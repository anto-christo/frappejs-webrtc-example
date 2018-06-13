var desk = (function () {
    'use strict';

    var webrtc = class WebRTC {

        constructor(){
            this.type;
            this.dataChannel;
            this.roomName;
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

    var webRTC = new webrtc();

    var socket$1 = io();
    window.socket = socket$1;

    $('#chat').hide();

    $('#createBtn').on('click',function(){
        var room = $('#createRoomName').val();
        webRTC.initConnection(room);
        $('#createModal').modal('toggle');
        $('#console').hide();
        $('#chat').show();
    });

    $('#joinBtn').on('click',function(){
        var room = $('#joinRoomName').val();
        webRTC.initConnection(room);
        $('#joinModal').modal('toggle');
        $('#console').hide();
        $('#chat').show();
    });

    $('#sendBtn').on('click',function(){
        var message = $('#message').val();

        $('#chat').append(`<div class="row">
                        <div class="col-sm-4">
                        </div>

                        <div class="col-sm-4">
                            <div class="card">
                                <div class="card-body">
                                    You:${message}
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                        </div>
                    </div>`);

        webRTC.sendData(message);

        $('#message').val('');

    });

    webRTC.onDataReceive = message =>{
        $('#chat').append(`<div class="row">
                        <div class="col-sm-4">
                        </div>

                        <div class="col-sm-4">
                            <div class="card">
                                <div class="card-body">
                                    Client:${message}
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                        </div>
                    </div>`);
    };

    var src = {

    };

    return src;

}());
//# sourceMappingURL=bundle.js.map
