const { GRID_SIZE } = require('./constants')

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity
}

function initGame() {
    const state = createGameState()
    randomFood(state)
    return state
}

function createGameState(){
    return {
        players: [{
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
        }, {
            pos: { 
                x: 19,
                y: 0
            },
            vel: {
                x: 0,
                y: 0
            },
            snake: [
                {x: 19, y: 0}
            ] 
        }],
        food: {}, //assigned in initGame above ^
        size: GRID_SIZE
    }
}

function gameLoop(state){
    if(!state){
        return
    }

    const playerOne = state.players[0]
    const playerTwo = state.players[1]
    
    //update player1 pos
    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE - 1 || 
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE - 1 ){
            return 2
    }

    //update player2 pos
    playerTwo.pos.x += playerTwo.vel.x
    playerTwo.pos.y += playerTwo.vel.y

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE - 1 || 
        playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE - 1 ){
            return 1
    }

    //player1 eats
    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state) 
    }

    //player2 eats
    if(state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y){
        playerTwo.snake.push({...playerTwo.pos})
        playerTwo.pos.x += playerTwo.vel.x
        playerTwo.pos.y += playerTwo.vel.y
        randomFood(state) 
    }

    //move player1
    if(playerOne.vel.x || playerOne.vel.y) { //to ensure the snake is actually supposed to move
        for(let cell of playerOne.snake){
            if(cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
                return 2
            }
        }
        playerOne.snake.push({...playerOne.pos}) //updated pos, check above
        playerOne.snake.shift()
    }

    //move player2
    if(playerTwo.vel.x || playerTwo.vel.y) { //to ensure the snake is actually supposed to move
        for(let cell of playerTwo.snake){
            if(cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y){
                return 1
            }
        }
        playerTwo.snake.push({...playerTwo.pos}) //updated pos, check above
        playerTwo.snake.shift()
    }

    return false //because there is no winner so far

}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }

    for(let player of state.players){
        for(let cell of player.snake){
            if(cell.x === food.x && cell.y === food.y){
                return randomFood(state)
            }
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