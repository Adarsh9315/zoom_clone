const { Socket } = require('dgram');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
})


app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomID: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        socket.join(roomID);
        socket.to(roomID).broadcast.emit('user-connected', userID);
    })
})

server.listen(2020);