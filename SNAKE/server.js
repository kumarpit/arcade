const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app) 
const io = socketio(server)

const { createGameState, gameLoop, getUpdatedVelocity } = require('./game')
const { FRAME_RATE } = require('./constants')

app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => {
    console.log(`[SERVER LISTENING ON ${PORT}]`)
})


io.on('connection', socket => {
    const state = createGameState()

    socket.on('keydown', handleKeydown)

    function handleKeydown(keyCode){
        try{
            keyCode = parseInt(keyCode)
        }catch(e){
            console.log(e)
            return
        }

        const vel = getUpdatedVelocity(keyCode)

        if(vel){
            state.player.vel = vel
        }
    }

    startGameInterval(socket, state)

    console.log('[NEW CONNECTION]')
})

function startGameInterval(socket, state) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state) //main game mechanics function, returns 0, 1, 2...(winner)

        if(!winner){
            socket.emit('gameState', JSON.stringify(state))
        }else{
            socket.emit('gameOver')
            clearInterval(intervalId)
        }
    }, 1000 / FRAME_RATE)
}


//npx allows you to use npm libs without installing them