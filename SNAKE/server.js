const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const PORT = process.env.PORT || 3000

const app = express()

const server = http.createServer(app) //creating an http server

//serve public folder
app.use(express.static(path.join(__dirname, 'public')))

//start server
server.listen(PORT, () => {
    console.log(`[SERVER LISTENING ON ${PORT}]`)
})


//multiplayer - same screen two snakes one food, if 2 snakes collide game over, longest snake wins