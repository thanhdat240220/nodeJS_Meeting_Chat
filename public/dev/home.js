(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home"],{

/***/ 0:
/*!***************************************************!*\
  !*** multi babel-polyfill ./App/src/home/home.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"201c");
module.exports = __webpack_require__(/*! ./App/src/home/home.js */"bhkj");


/***/ }),

/***/ "bhkj":
/*!******************************!*\
  !*** ./App/src/home/home.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ../home/home.css */ "dGrl");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Home = /*#__PURE__*/function () {
  function Home() {
    _classCallCheck(this, Home);

    this.socket = io('/');
    this.videoGrid = document.getElementById('video-grid');
    this.createPeer();
    this.createMyVideo();
  }

  _createClass(Home, [{
    key: "createPeer",
    value: function createPeer() {
      var _this = this;

      this.peers = {};
      this.peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: location.hostname === 'localhost' ? PORT : '',
        config: {
          'iceServers': [{
            url: 'stun:stun01.sipphone.com'
          }, {
            url: 'stun:stun.ekiga.net'
          }, {
            url: 'stun:stun.fwdnet.net'
          }, {
            url: 'stun:stun.ideasip.com'
          }, {
            url: 'stun:stun.iptel.org'
          }, {
            url: 'stun:stun.rixtelecom.se'
          }, {
            url: 'stun:stun.schlund.de'
          }, {
            url: 'stun:stun.l.google.com:19302'
          }, {
            url: 'stun:stun1.l.google.com:19302'
          }, {
            url: 'stun:stun2.l.google.com:19302'
          }, {
            url: 'stun:stun3.l.google.com:19302'
          }, {
            url: 'stun:stun4.l.google.com:19302'
          }, {
            url: 'stun:stunserver.org'
          }, {
            url: 'stun:stun.softjoys.com'
          }, {
            url: 'stun:stun.voiparound.com'
          }, {
            url: 'stun:stun.voipbuster.com'
          }, {
            url: 'stun:stun.voipstunt.com'
          }, {
            url: 'stun:stun.voxgratia.org'
          }, {
            url: 'stun:stun.xten.com'
          }, {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
          }, {
            url: 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
          }, {
            url: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
          }]
        }
      });
      this.peer.on('open', function (id) {
        //console.log('peer open');
        _this.socket.emit('vao-phong', Room_ID, id);
      });
    }
  }, {
    key: "createMyVideo",
    value: function createMyVideo() {
      var _this2 = this;

      this.myVideo = document.createElement('video');
      this.myVideoStream = null;
      this.myVideo.muted = true; // get video device

      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(function (stream) {
        //console.log('stream');
        _this2.myVideoStream = stream;

        _this2.addVideoStream(_this2.myVideo, stream);

        _this2.thenCallFromPeer(stream);

        _this2.socket.on('da-vao', function (e) {
          //console.log('nguoi dung ID=' + e.userId + " da vao phong ");
          _this2.connectToNewUser(e.userId, stream);
        });
      });
    }
  }, {
    key: "connectToNewUser",
    value: function connectToNewUser(userId, stream) {
      var _this3 = this;

      var call = this.peer.call(userId, stream);
      var videoTag = document.createElement('video');
      call.on('stream', function (remoteStream) {
        //console.log('peer stream');
        _this3.addVideoStream(videoTag, remoteStream);
      });
      call.on('close', function () {
        videoTag.remove();
      });
      this.peers[userId] = call;
    }
  }, {
    key: "thenCallFromPeer",
    value: function thenCallFromPeer(stream) {
      var _this4 = this;

      this.peer.on('call', function (call) {
        //console.log('peer call');
        call.answer(stream);
        var videoTag = document.createElement('video');
        call.on('stream', function (remoteStream) {
          //console.log('peer stream');
          _this4.addVideoStream(videoTag, remoteStream);
        });
      });
    }
  }, {
    key: "addVideoStream",
    value: function addVideoStream(video, stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
      this.videoGrid.append(video);
    }
  }]);

  return Home;
}();

new Home(); // const peers = {};
// const socket = io('/');
// const videoGrid = document.getElementById('video-grid');
// const myVideo = document.createElement('video');
// myVideo.muted = true;
// const peer = new Peer(undefined, {
//     path: '/peerjs',
//     host: '/',
//     port: location.hostname === 'localhost' ? PORT : '',
//     config: {
//         'iceServers': [
//             { url: 'stun:stun01.sipphone.com' },
//             { url: 'stun:stun.ekiga.net' },
//             { url: 'stun:stun.fwdnet.net' },
//             { url: 'stun:stun.ideasip.com' },
//             { url: 'stun:stun.iptel.org' },
//             { url: 'stun:stun.rixtelecom.se' },
//             { url: 'stun:stun.schlund.de' },
//             { url: 'stun:stun.l.google.com:19302' },
//             { url: 'stun:stun1.l.google.com:19302' },
//             { url: 'stun:stun2.l.google.com:19302' },
//             { url: 'stun:stun3.l.google.com:19302' },
//             { url: 'stun:stun4.l.google.com:19302' },
//             { url: 'stun:stunserver.org' },
//             { url: 'stun:stun.softjoys.com' },
//             { url: 'stun:stun.voiparound.com' },
//             { url: 'stun:stun.voipbuster.com' },
//             { url: 'stun:stun.voipstunt.com' },
//             { url: 'stun:stun.voxgratia.org' },
//             { url: 'stun:stun.xten.com' },
//             {
//                 url: 'turn:numb.viagenie.ca',
//                 credential: 'muazkh',
//                 username: 'webrtc@live.com'
//             },
//             {
//                 url: 'turn:192.158.29.39:3478?transport=udp',
//                 credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//                 username: '28224511:1379330808'
//             },
//             {
//                 url: 'turn:192.158.29.39:3478?transport=tcp',
//                 credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
//                 username: '28224511:1379330808'
//             }
//         ]
//     }
// });
// let myVideoStream = null;
// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
// }).then((stream) => {
//     console.log('stream');
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);
//     peer.on('call', function (call) {
//         console.log('peer call', stream);
//         call.answer(stream);
//         const videoTag = document.createElement('video');
//         call.on('stream', function (remoteStream) {
//             console.log('peer stream');
//             addVideoStream(videoTag, remoteStream);
//         });
//     });
//     socket.on('da-vao', (e) => {
//         console.log('nguoi dung ID=' + e.userId + " da vao phong ");
//         connectToNewUser(e.userId, stream);
//     });
// });
// peer.on('open', (id) => {
//     console.log('peer open');
//     socket.emit('vao-phong', Room_ID, id);
// });
// socket.on('user-disconnected', userId => {
//     if (peers[userId]) peers[userId].close();
// })
// const connectToNewUser = (userId, stream) => {
//     var call = peer.call(userId, stream);
//     const videoTag = document.createElement('video');
//     call.on('stream', function (remoteStream) {
//         console.log('peer stream');
//         addVideoStream(videoTag, remoteStream);
//     });
//     call.on('close', () => {
//         videoTag.remove();
//     });
//     peers[userId] = call
// }
// const addVideoStream = (video, stream) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     videoGrid.append(video);
// };

/***/ }),

/***/ "dGrl":
/*!*******************************!*\
  !*** ./App/src/home/home.css ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

},[[0,"runtime","vendors~home"]]]);
//# sourceMappingURL=home.js.map