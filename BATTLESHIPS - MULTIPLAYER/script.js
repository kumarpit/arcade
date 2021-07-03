document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user')
    const compGrid = document.querySelector('.grid-computer')
    const displayGrid = document.querySelector('.grid-display')
    const ships = document.querySelectorAll('.ship')
    const destroyer = document.querySelector('.destroyer-container')
    const submarine = document.querySelector('.submarine-container')
    const cruiser = document.querySelector('.cruiser-container')
    const battleship = document.querySelector('.battleship-container')
    const carrier = document.querySelector('.carrier-container')
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    const turnDisplay = document.querySelector('#turn-name')
    const infoDisplay = document.querySelector('#info')

    const dim = 10

    const userSquares = []
    const compSquares = []

    //create boards
    function createBoard(grid, arr){
        for(let i = 0; i < dim * dim; i++){
            let square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            arr.push(square)
        }
    }

    createBoard(userGrid, userSquares)
    createBoard(compGrid, compSquares)

    //ship positions
    const shipSpecs = [
        {
            name: 'destroyer',
            orientations: [
                [0, 1]
                [0, dim]
            ]
        },
        {
            name: 'submarine',
            orientation: [
                [0, 1, 2],
                [0, dim, dim * 2]
            ]
        },
        {
            name: 'cruiser',
            orientation: [
                [0, 1, 2],
                [0, dim, dim * 2]
            ]
        },
        {
            name: 'battleship',
            orientation: [
                [0, 1, 2, 3],
                [0, dim, dim * 2, dim * 3]
            ]
        },
        {
            name: 'carrier',
            orientation: [
                [0, 1, 2, 3, 4],
                [0, dim, dim * 2, dim * 3, dim * 4]
            ]
        },
    ]

    //draw ships in random positions
    function generateShips(ship){
        let dir = Math.floor(Math.random() * ship.orientation.length) 
        let currentDir = ship.orientation[dir]

        if(dir == 0) jumps = 1
        if(dir == 1) jumps = 10

    }
})