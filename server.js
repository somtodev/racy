const express = require('express')
const http = require('http')
const ejs = require('ejs')
const path = require('path')
const { Console } = require('console')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})


const server = http.createServer(app)
server.listen(PORT, (error) => {
    if (error) {
        console.log('Ops, Something went wrong :(')
    } else {
        console.log('Listening @ PORT: ' + PORT)
    }
})

const io = require('socket.io')(server)

const users = {}

io.on('connection', function (socket) {
    console.log('User Join')

    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message, name: users[socket.id] })
    })

});
