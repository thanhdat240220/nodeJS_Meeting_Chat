const peers = {};
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: PORT //443 //process.env.PORT || "3030"
});

let myVideoStream = null;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then((stream) => {
    console.log('stream');
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', function (call) {
        console.log('peer call');
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

