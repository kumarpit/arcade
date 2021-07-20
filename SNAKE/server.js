const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app) 
const io = socketio(server)

const { initGame, gameLoop, getUpdatedVelocity } = require('./game')
const { FRAME_RATE } = require('./constants')
const { makeId } = require('./utils')

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => {
    console.log(`[SERVER LISTENING ON ${PORT}]`)
})

const state = {} //roomName: state
const rooms = {} //lookup table clientId: room#

io.on('connection', socket => {
    socket.on('keydown', handleKeydown)
    socket.on('newGame', handleNewGame)
    socket.on('joinGame', handleJoinGame)

    function handleJoinGame(code){
        const room = io.sockets.adapter.rooms.has(code)
        // console.log(code)
        // console.log(room)
        // console.log(io.sockets.adapter.rooms)
        // let allUsers

        // if(room){
        //     allUsers = room.sockets //socketId: socket
        // }

        // let numSockets = 0
        // if(allUsers){
        //     numSockets = Object.keys(allUsers).length
        // }

        // if(numSockets === 0){
        //     socket.emit('unknownGame')
        //     return
        // }else if(numSockets > 1){
        //     socket.emit('roomFull')
        //     return
        // }

        console.log(room)

        if(room){
            rooms[socket.id] = code
            socket.join(code)
            socket.number = 2
            socket.emit('init', 2)
        }

        startGameInterval(code)
    }

    function handleNewGame(){
        let roomName = makeId(5)
        rooms[socket.id] = roomName
        socket.emit('gameCode', roomName)

        state[roomName] = initGame()

        socket.join(roomName)
        socket.number = 1
        socket.emit('init', 1)
    }

    function handleKeydown(keyCode){
        const roomName = rooms[socket.id]

        if(!roomName) {
            return
        }

        try{
            keyCode = parseInt(keyCode)
        }catch(e){
            console.log(e)
            return
        }

        const vel = getUpdatedVelocity(keyCode)

        if(vel){
            state[roomName].players[socket.number - 1].vel = vel
        }
    }

    // console.log('[NEW CONNECTION]' + ' PLAYER: ' + socket.number)
})

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]) //main game mechanics function, returns 0, 1, 2...(winner)

        if(!winner){
            emitGameState(roomName, state[roomName])
        }else{
            emitGameOver(roomName, winner)
            // state[roomName] = null
            clearInterval(intervalId)
        }
    }, 1000 / FRAME_RATE)
}

function emitGameState(roomName, state){
    io.sockets.in(roomName).emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner){
    io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }))
}


//npx allows you to use npm libs without installing them