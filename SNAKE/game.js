const { GRID_SIZE } = require('./constants')

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity
}

function createGameState(){
    return {
        player: {
            pos: { 
                x: 0,
                y: 0
            },
            vel: {
                x: 0,
                y: 0
            },
            snake: [
                {x: 0, y: 0}
            ]
        },
        food: {
            x: 7,
            y: 7
        },
        size: GRID_SIZE
    }
}

function gameLoop(state){
    if(!state){
        return
    }

    const playerOne = state.player
    
    //update player pos
    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE - 1 || 
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE - 1 ){
            return true
    }

    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state) //!!!
    }

    if(playerOne.vel.x || playerOne.vel.y) { //to ensure the snake is actually supposed to move
        for(let cell of playerOne.snake){
            if(cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
                return true
            }
        }

        playerOne.snake.push({...playerOne.pos}) //updated pos, check above
        playerOne.snake.shift()
    }

    return false //because there is no winner so far

}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }

    for(let cell of state.player.snake){
        if(cell.x === food.x && cell.y === food.y){
            return randomFood(state)
        }
    }

    state.food = food
}

function getUpdatedVelocity(keyCode){
    switch (keyCode){
        case 37: {
            return {x: -1, y: 0}
        }

        case 38: {
            return {x: 0, y: -1}
        }

        case 39: {
            return {x: 1, y: 0}
        }

        case 40: {
            return {x: 0, y: 1}
        }
    }
}