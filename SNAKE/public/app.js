const BG_COLOR = 'whitesmoke'
const SNAKE_COLOR = 'deepskyblue'
const FOOD_COLOR= 'red'
const socket = io()

socket.on('init', handleInit)
socket.on('gameState', handleGameState)

let canvas, ctx

let gameState = {
    player: {
        pos: { //head of snake
            x: 3,
            y: 10
        },
        vel: {
            x: 1,
            y: 0
        },
        snake: [
            {x: 1, y: 10}, 
            {x: 2, y: 10},
            {x: 3, y: 10}
        ]
    },
    food: {
        x: 7,
        y: 7
    },
    scl: 20
}

function init(){
    canvas = document.getElementById('gameCanvas')
    ctx = canvas.getContext('2d')

    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', keydown)

    renderState(gameState)
}

function keydown(e){
    console.log(e.keyCode)
}

init()

function renderState(state){
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //disassembling state for ease of use
    const scl = state.scl
    const food = state.food
    const size = canvas.width / scl

    ctx.fillStyle = FOOD_COLOR
    ctx.fillRect(food.x * scl, food.y * scl, scl, scl)

    renderPlayer(state.player, scl, SNAKE_COLOR)
}

function renderPlayer(player, scl, color){
    const snake = player.snake

    ctx.fillStyle = color
    for(let cell of snake){
        ctx.fillRect(cell.x * scl, cell.y * scl, scl, scl)
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
}