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
            orientation: [
                [0, 1],
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
    function generateShip(ship){
        let dir = Math.floor(Math.random() * ship.orientation.length) 
        let currentDir = ship.orientation[dir]

        if(dir == 0) jumps = 1
        if(dir == 1) jumps = 10

        let startPos = Math.abs(Math.floor(Math.random() * compSquares.length - ship.orientation[0].length * jumps))

        const isTaken = currentDir.some(index => compSquares[startPos + index].classList.contains('taken'))
        const beyondEdge = (startPos % dim) > (startPos + ((ship.orientation[0].length - 1) * jumps)) % dim
        
        if(!isTaken && !beyondEdge) currentDir.forEach(index => {
            compSquares[startPos + index].classList.add('taken', ship.name)
            return
        })

        else{
            generateShip(ship)
        }
    }

    for(ship of shipSpecs){
        generateShip(ship)
    }

    destroyer.onclick = () => {
        destroyer.classList.toggle('destroyer-container-vertical')
    }

    submarine.onclick = () => {
        submarine.classList.toggle('submarine-container-vertical')
    }

    cruiser.onclick = () => {
        cruiser.classList.toggle('cruiser-container-vertical')
    }

    battleship.onclick = () => {
        battleship.classList.toggle('battleship-container-vertical')
    }

    carrier.onclick = () => {
        carrier.classList.toggle('carrier-container-vertical')
    }

    //drag and drop to user grid
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => {
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('dragenter', dragEnter)
        square.addEventListener('dragleave', dragLeave)
        square.addEventListener('drop', dragDrop)
        square.addEventListener('dragend', dragEnd)
    })

    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength

    ships.forEach(ship => {
        ship.addEventListener('mousedown', (e) => {
            selectedShipNameWithIndex = e.target.id
            console.log(selectedShipNameWithIndex)
        })
    })

    function dragStart(){ //don't need to pass event, can use 'this' instead
        draggedShip = this
        draggedShipLength = this.children.length
        console.log(draggedShip, draggedShipLength)
    }

    function dragOver(e){
        e.preventDefault()
    }

    function dragEnter(e){
        e.preventDefault()
    }

    function dragLeave(){
        //dont really need this
    }

    //main function
    function dragDrop(){
        let shipNameWithLastId = draggedShip.children[0].id
        let shipClass = shipNameWithLastId.slice(0, -2)
        console.log(shipClass)
    }

    function dragEnd(){

    }

})