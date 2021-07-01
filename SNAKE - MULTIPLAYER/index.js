const BG_COLOR = '#333333'
const SNAKE_COLOR = '#FFFFFF'
const FOOD_COLOR = '#FF1133'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')


function init(){
    canvas.width = canvas.height = 450

    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    document.addEventListener('keydown', (e) => {
        console.log(e.code)
    })
}

init()