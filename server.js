const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const path = require('path');

const peerServer = ExpressPeerServer(server, {
    debug: true,
});


app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, './public/views'));
app.use('/peerjs', peerServer);
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    res.render('index', { roomId: req.params.room, port: process.env.PORT || 3030 });
});

let quantity = 0;
io.on('connection', (socket) => {
    socket.on('vao-phong', (roomId, userId) => {
        //console.log('vao phong -s');
        quantity++;
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('da-vao', { userId });

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    });

});


server.listen(process.env.PORT || 3030);


