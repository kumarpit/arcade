const { GRID_SIZE } = require('./constants')

module.exports = {
    createGameState,
    gameLoop
}

function createGameState(){
    return {
        player: {
            pos: { 
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
        scl: GRID_SIZE
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

    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || 
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE ){
            return 2
    }

    if(state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y){
        //grow
    }

}