const BG_COLOR = '#333333'
const SNAKE_COLOR = '#FFFFFF'
const FOOD_COLOR = '#FF1133'
const FPS = 15

const socket = io('http://localhost:5500')

socket.on('init',  handleInit)

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

const gameState = {
    player: {
        head: {
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
        x: 5,
        y: 2
    },
    scl: 20
}

function init(){
    canvas.width = canvas.height = 500

    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

let lastTime = 0;
let deltaTime = 0;
let countTime = 0;
let interval = 1000 / FPS;

function draw(time){
    if(time){
        deltaTime = time - lastTime
        countTime += deltaTime
        lastTime = time
    }

    if(countTime > interval){
        init()
        let {player, food, scl} = gameState
        let {snake, vel} = player

        //draw snake
        ctx.fillStyle = SNAKE_COLOR
        for(let i = 0; i < snake.length; i++){
            snake[i].x += vel.x
            snake[i].y += vel.y
            ctx.fillRect(snake[i].x * scl, snake[i].y * scl, scl, scl)
        }

        //draw food
        ctx.fillStyle = FOOD_COLOR
        ctx.fillRect(food.x * scl, food.y * scl, scl, scl) 

        countTime = 0
    }

    requestAnimationFrame(draw)
}

document.addEventListener('keydown', e => {
    console.log(e.code)
})

init()
draw()

window.requestAnimationFrame(draw)

function handleInit(msg){
    console.log(msg)
}