const BG_COLOR = 'whitesmoke'
const SNAKE_COLOR = 'deepskyblue'
const FOOD_COLOR= 'red'
const socket = io()
let scoreDisplay = document.getElementById('score')

socket.on('init', handleInit)
socket.on('gameState', handleGameState)

let canvas, ctx

let gameState

function init(){
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')

    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)

    renderState(gameState)
}

function keydown(e){
    socket.emit('keydown', e.keyCode)
}

init()

function renderState(state){
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //disassembling state for ease of use
    const size = state.size
    const food = state.food
    const scale = canvas.width / size

    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(food.x * scale, food.y * scale, scale, scale)

    renderPlayer(state.player, scale, SNAKE_COLOR)
}

function renderPlayer(player, scale, color){
    const snake = player.snake

    ctx.fillStyle = color
    for(let cell of snake){
        ctx.fillRect(cell.x * scale, cell.y * scale, scale, scale)
    }
}

function handleInit(msg){
    console.log(msg)
}

function handleGameState(state){
    gameState = JSON.parse(state)
    requestAnimationFrame(() => {
        renderState(gameState)
    })

    scoreDisplay.innerHTML = gameState.player.snake.length - 1
}