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
 

})