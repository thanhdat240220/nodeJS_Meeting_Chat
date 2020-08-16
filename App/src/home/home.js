import '../home/home.css';

class Home {
    constructor() {
        this.socket = io('/');
        this.videoGrid = document.getElementById('video-grid');
        this.createPeer();
        this.createMyVideo();
    }

    createPeer() {
        this.peers = {};
        this.peer = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: location.hostname === 'localhost' ? PORT : '',
            config: {
                'iceServers': [
                    { url: 'stun:stun01.sipphone.com' },
                    { url: 'stun:stun.ekiga.net' },
                    { url: 'stun:stun.fwdnet.net' },
                    { url: 'stun:stun.ideasip.com' },
                    { url: 'stun:stun.iptel.org' },
                    { url: 'stun:stun.rixtelecom.se' },
                    { url: 'stun:stun.schlund.de' },
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'stun:stun1.l.google.com:19302' },
                    { url: 'stun:stun2.l.google.com:19302' },
                    { url: 'stun:stun3.l.google.com:19302' },
                    { url: 'stun:stun4.l.google.com:19302' },
                    { url: 'stun:stunserver.org' },
                    { url: 'stun:stun.softjoys.com' },
                    { url: 'stun:stun.voiparound.com' },
                    { url: 'stun:stun.voipbuster.com' },
                    { url: 'stun:stun.voipstunt.com' },
                    { url: 'stun:stun.voxgratia.org' },
                    { url: 'stun:stun.xten.com' },
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    }
                ]
            }
        });

        this.peer.on('open', (id) => {
            //console.log('peer open');
            this.socket.emit('vao-phong', Room_ID, id);
        });
    }

    createMyVideo() {
        this.myVideo = document.createElement('video');
        this.myVideoStream = null;
        this.myVideo.muted = true;
        // get video device
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            //console.log('stream');
            this.myVideoStream = stream;
            this.addVideoStream(this.myVideo, stream);

            this.thenCallFromPeer(stream);

            this.socket.on('da-vao', (e) => {
                //console.log('nguoi dung ID=' + e.userId + " da vao phong ");
                this.connectToNewUser(e.userId, stream);
            });
        });
    }

    connectToNewUser(userId, stream) {
        var call = this.peer.call(userId, stream);
        const videoTag = document.createElement('video');
        call.on('stream', (remoteStream) => {
            //console.log('peer stream');
            this.addVideoStream(videoTag, remoteStream);
        });

        call.on('close', () => {
            videoTag.remove();
        });

        this.peers[userId] = call
    }

    thenCallFromPeer(stream) {
        this.peer.on('call', (call) => {
            //console.log('peer call');
            call.answer(stream);
            const videoTag = document.createElement('video');
            call.on('stream', (remoteStream) => {
                //console.log('peer stream');
                this.addVideoStream(videoTag, remoteStream);
            });
        });
    }

    addVideoStream(video, stream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        this.videoGrid.append(video);
    };
}

new Home();
