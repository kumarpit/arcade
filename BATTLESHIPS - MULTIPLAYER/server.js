const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

//set static folder -- the folder the server serves to the client
app.use(express.static(path.join(__dirname, 'public')))

//start server
server.listen(PORT, () => {
    console.log(`[SERVER RUNNING ON ${PORT}]`)
})

//handle socket connection request from web client

const connections = [null, null] //only two players can play at a time
io.on('connection', socket => {
    // console.log('[NEW WS CONNECTION]')

    //find available player number
    let playerIndex = -1
    for(const i in connections){
        if(connections[i] === null){
            playerIndex = i
            connections[i] = i
            break
        }
    }

    //output player number to client
    socket.emit('player-number', playerIndex) //will tell the connecting socket what player number they are
    console.log(`[PLAYER ${playerIndex} CONNECTED]`)
 
    //ignore extra players
    if(playerIndex === -1) return

    connections[playerIndex] = false //to keep track of player ready -> ships placed
    
    //tell everyone what player number connnected
    socket.broadcast.emit('player-connection', playerIndex) //sends msg to all socket connections

    //handle disconnect
    socket.on('disconnect', () => {
        console.log(`Player ${playerIndex} has disconnected`)
        connections[playerIndex] = null
        //tell everyone who disconnected
        socket.broadcast.emit('player-connection', playerIndex)
    })

    //on ready - listening when the connected socket emits 'ready' msg
    socket.on('player-ready', () => {
        socket.broadcast.emit('enemy-ready', playerIndex)
        connections[playerIndex] = true
    })

    //check player connections, if you connect after other players already in room
    socket.on('check-players', () => {
        const players = []
        for(const i in connections){
            connections[i] === null ? players.push({connected: false, ready: false}) : 
            players.push({connected: true, ready: connections[i]})
        }

        socket.emit('check-players', players)
    })

    //on fire recieved
    socket.on('fire', id => {
        console.log(`shots fired from ${playerIndex} at squares ${id}`)

        //send the move to the enemy
        socket.broadcast.emit('fire', id)
    })

    //on fire reply - returns the square of the enemy that the player fired on
    socket.on('fire-reply', square => {
        console.log(square)
        //send the reply to the other player
        socket.broadcast.emit('fire-reply', square)
    })

})