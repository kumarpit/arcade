const BG_COLOR = 'whitesmoke'
const SNAKE_COLOR = 'black'
const FOOD_COLOR= 'red'
const socket = io()

const gameScreen= document.getElementById('gameScreen')
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGame')
const joinGameBtn = document.getElementById('joinGame')
const gameCodeInput = document.getElementById('gameCode')
const scoreDisplay = document.getElementById('score')
const codeDisplay = document.getElementById('codeDisplay')

let canvas, ctx, gameState, playerNum

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

function newGame(){
    socket.emit('newGame')
    init()
}

function joinGame(){
    const code = gameCodeInput.value
    console.log(code)
    socket.emit('joinGame', code)
    init()
}

function init(){
    initialScreen.style.display = 'none'
    gameScreen.style.display = 'flex'

    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)
    socket.on('init', handleInit)
    socket.on('gameState', handleGameState)
    socket.on('gameOver', handleGameOver)
    socket.on('gameCode', handleGameCode)
    socket.on('unknownGame', handleUnknownGame)
    socket.on('roomFull', handleRoomFull)

    // renderState(gameState)
}

function keydown(e){
    socket.emit('keydown', e.keyCode)
}

// init()

function renderState(state){
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //disassembling state for ease of use
    const size = state.size
    const food = state.food
    const scale = canvas.width / size

    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale)

    renderPlayer(state.players[0], scale, SNAKE_COLOR)
    renderPlayer(state.players[1], scale, 'rgba(0, 0, 0, 0.5)')
}

function renderPlayer(player, scale, color){
    const snake = player.snake

    ctx.fillStyle = color
    for(let cell of snake){
        ctx.fillRect(cell.x * scale, cell.y * scale, scale, scale)
    }
}

function handleInit(num){
    playerNum = num
    console.log(num)
}

function handleGameState(state){
    gameState = JSON.parse(state)
    requestAnimationFrame(() => {
        renderState(gameState)
    })

    scoreDisplay.innerHTML = gameState.players[playerNum - 1].snake.length - 1
}

function handleGameOver(data){
    data = JSON.parse(data)

    if(data.winner === playerNum){
        scoreDisplay.innerHTML = `${scoreDisplay.innerHTML} YOU WIN`
    }else{
        scoreDisplay.innerHTML = `${scoreDisplay.innerHTML} YOU LOSE`
    } 
}

function handleGameCode(code){
    codeDisplay.innerHTML = code
}

function handleUnknownGame(){
    reset()
    console.log('unknown game code')
}

function handleRoomFull(){
    reset()
    console.log('room full')
}

function reset(){
    initialScreen.style.display = 'flex'
    gameScreen.style.display = 'none'
    playerNum = null
    gameCodeInput.value = ''
    codeDisplay.innerHTML = ''
}

