// import '../home/home.css';

// class Home {
//     constructor() {
//         this.socket = io('/');
//         this.videoGrid = document.getElementById('video-grid');
//         this.createPeer();
//         this.createMyVideo();
//     }

//     createPeer() {
//         this.peers = {};
//         this.peer = new Peer(undefined, {
//             path: '/peerjs',
//             host: '/',
//             port: location.hostname === 'localhost' ? PORT : '',
//             config: {
//                 'iceServers': [
//                     { url: 'stun:stun.l.google.com:19302' },
//                     { url: 'stun:stun1.l.google.com:19302' },
//                     { url: 'stun:stun.ekiga.net' },
//                     { url: 'stun:stun2.l.google.com:19302' },
//                     { url: 'stun:stun3.l.google.com:19302' },
//                     { url: 'stun:stun4.l.google.com:19302' },
//                     { url: 'stun:stun01.sipphone.com' },
//                 ]
//             }
//         });

//         this.peer.on('open', (id) => {
//             //console.log('peer open');
//             this.socket.emit('vao-phong', Room_ID, id);
//         });
//     }

//     createMyVideo() {
//         this.myVideo = document.createElement('video');
//         this.myVideoStream = null;
//         this.myVideo.muted = true;
//         // get video device
//         navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true
//         }).then((stream) => {
//             //console.log('stream');
//             this.myVideoStream = stream;
//             this.addVideoStream(this.myVideo, stream);

//             this.thenCallFromPeer(stream);

//             this.socket.on('da-vao', (e) => {
//                 //console.log('nguoi dung ID=' + e.userId + " da vao phong ");
//                 this.connectToNewUser(e.userId, stream);
//             });
//         });
//     }

//     connectToNewUser(userId, stream) {
//         var call = this.peer.call(userId, stream);
//         const videoTag = document.createElement('video');
//         call.on('stream', (remoteStream) => {
//             //console.log('peer stream');
//             this.addVideoStream(videoTag, remoteStream);
//         });

//         call.on('close', () => {
//             videoTag.remove();
//         });

//         this.peers[userId] = call
//     }

//     thenCallFromPeer(stream) {
//         this.peer.on('call', (call) => {
//             //console.log('peer call');
//             call.answer(stream);
//             const videoTag = document.createElement('video');
//             call.on('stream', (remoteStream) => {
//                 //console.log('peer stream');
//                 this.addVideoStream(videoTag, remoteStream);
//             });
//         });
//     }

//     addVideoStream(video, stream) {
//         video.srcObject = stream;
//         video.addEventListener('loadedmetadata', () => {
//             video.play();
//         });
//         this.videoGrid.append(video);
//     };
// }

// new Home();

const peers = {};
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: location.hostname === 'localhost' ? PORT : '',
    config: {
        'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            { url: 'stun:stun1.l.google.com:19302' },
            { url: 'stun:stun.ekiga.net' },
            { url: 'stun:stun2.l.google.com:19302' },
            { url: 'stun:stun3.l.google.com:19302' },
            { url: 'stun:stun4.l.google.com:19302' },
            { url: 'stun:stun01.sipphone.com' },
        ]
    }
});

let myVideoStream = null;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    console.log('stream');
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', function (call) {
        console.log('peer call', stream);
        call.answer(stream);
        const videoTag = document.createElement('video');
        call.on('stream', function (remoteStream) {
            console.log('peer stream');
            addVideoStream(videoTag, remoteStream);
        });
    });

    socket.on('da-vao', (e) => {

        console.log('nguoi dung ID=' + e.userId + " da vao phong ");
        connectToNewUser(e.userId, stream);
    });
});

peer.on('open', (id) => {
    console.log('peer open');
    socket.emit('vao-phong', Room_ID, id);
});

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
})

const connectToNewUser = (userId, stream) => {
    var call = peer.call(userId, stream);
    const videoTag = document.createElement('video');
    call.on('stream', function (remoteStream) {
        console.log('peer stream');
        addVideoStream(videoTag, remoteStream);
    });

    call.on('close', () => {
        videoTag.remove();
    });

    peers[userId] = call
}


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
};

