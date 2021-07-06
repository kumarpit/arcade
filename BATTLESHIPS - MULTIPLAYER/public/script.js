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
    const singlePlayerButton = document.querySelector('#single-player')
    const multiPlayerButton = document.querySelector('#multi-player')
    const playersStatus = document.querySelector('.players-status')
    const dim = 10
    const userSquares = []
    const compSquares = []

    //multiplayer additions
    let gameMode = ''
    let playerNum = 0
    let ready = false
    let enemyReady = false
    let allShipPlaced = false
    let shotFired = -1

    //select player mode
    singlePlayerButton.addEventListener('click', startSinglePlayer) //set up single player game
    multiPlayerButton.addEventListener('click', startMultiPlayer) //set up multiplayer game
    
    //single player function
    function startSinglePlayer(){
        gameMode = 'singlePlayer'

        for(ship of shipSpecs){
            generateShip(ship)
        }

        startButton.style.display = 'block'

        startButton.onclick = () => {
            if(displayGrid.children.length == 0){
                infoDisplay.innerHTML = ''
                playSingleGame() //begin playing
            }else{
                infoDisplay.innerHTML = 'Place all your ships'
            }
        }
    }

    //multiplayer function
    function startMultiPlayer(){
        playersStatus.style.display = 'flex'
        startButton.style.display = 'block'
        gameMode = 'multiPlayer'

        const socket = io() //only want to use socket when in multiplayer

        //get player number
        socket.on('player-number', num => {
            if(num === -1){
                infoDisplay.innerHTML= 'ROOM FULL'
            }else{
                playerNum = parseInt(num)
                if(playerNum === 1) currentPlayer = 'enemy'
                let player = `.player-${parseInt(num) + 1}`
                document.querySelector(`${player}`).style.fontWeight = 'bold'
                document.querySelector(`${player} .connected span`).classList.toggle('green')
                
                //get other player status
                socket.emit('check-players')
            }
        })

        //another player has connected
        socket.on('player-connection', num => {
            console.log(`Player number ${num} has connected`)
            playerConnectedOrDisconnected(num)
        })

        //on enemy ready
        socket.on('enemy-ready', num => {
            enemyReady = true
            playerReady(num)
            if(ready) playMultiGame(socket) //allows auto play when you ready before enemy
        })

        //check player status
        socket.on('check-players', players => {
            players.forEach((player, i) => {
                if(player.connected){
                    if(i !== playerNum){
                        playerConnectedOrDisconnected(i)
                    }
                }
                if(player.ready){
                    playerReady(i)
                    if(i !== playerNum){
                        enemyReady = true
                    }
                }
            })
        })
        function playerConnectedOrDisconnected(num){
            let player =  `.player-${parseInt(num) + 1}`
            document.querySelector(`${player} .connected span`).classList.toggle('green')
        }

        startButton.addEventListener('click', () => {
            if(displayGrid.children.length == 0) {
                playMultiGame(socket)
            }else{
                infoDisplay.innerHTML = 'Place all your ships'
            }
        })
    }

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

    //draw ships in random positions
    function generateShip(ship){
        let dir = Math.floor(Math.random() * ship.orientation.length) 
        let currentShip = ship.orientation[dir]

        if(dir == 0) jumps = 1
        if(dir == 1) jumps = 10

        let startPos = Math.abs(Math.floor(Math.random() * compSquares.length - ship.orientation[0].length * jumps)) //always less than 99-ship length

        const isTaken = currentShip.some(index => compSquares[startPos + index].classList.contains('taken'))
        const beyondEdge = (startPos % dim) > (startPos + ((ship.orientation[0].length - 1) * jumps)) % dim
        
        if(!isTaken && !beyondEdge) currentShip.forEach(index => {
            compSquares[startPos + index].classList.add('hide', 'taken', ship.name)
            return
        })

        else{
            generateShip(ship)
        }
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
        square.addEventListener('drop', dragDrop)
    })

    let selectedShipNameWithIndex
    let draggedShip
    let draggedShipLength

    ships.forEach(ship => {
        ship.addEventListener('mousedown', (e) => {
            selectedShipNameWithIndex = e.target.id
        })
    })

    function dragStart(){ //don't need to pass event, can use 'this' instead
        draggedShip = this
        draggedShipLength = this.children.length
    }

    function dragOver(e){
        e.preventDefault()
    }

    function dragEnter(e){
        e.preventDefault()
    }

    function dragDrop(e){
        let lastIndex = draggedShipLength - 1
        let shipNameWithLastId = draggedShip.children[lastIndex].id
        let shipClass = shipNameWithLastId.slice(0, -2)
        let selectedIndex = parseInt(selectedShipNameWithIndex.substr(-1))
        let dropIndex = parseInt(e.target.dataset.id)
        
        let cellsToLast = lastIndex - selectedIndex
        let cellsToFirst = selectedIndex

        if(!draggedShip.classList.contains(`${shipClass}-container-vertical`)){ //horizontal
            if((dropIndex + cellsToLast)  % 10 < dropIndex % 10 || //checking right and left edge
               (dropIndex - cellsToFirst) % 10 > dropIndex % 10 ||
               (taken(dropIndex - cellsToFirst, draggedShipLength, true))){
                return
            }else{
                let startIndex = dropIndex - cellsToFirst
                for(let i = startIndex; i < startIndex + draggedShipLength; i++){
                    userSquares[i].classList.add('taken', shipClass)
                }
                displayGrid.removeChild(draggedShip)
            }
        }else{ //vertical
            if(dropIndex + (cellsToLast * dim) > 99  || //beyond bottom edge
              (dropIndex - (cellsToFirst * dim) < 0) || //beyond top edge
              (taken(dropIndex - cellsToFirst, draggedShipLength * dim, false))){
                  return
            }else{
                let startIndex = dropIndex - cellsToFirst
                for(let i = startIndex; i < startIndex + (draggedShipLength * dim); i += dim){
                    userSquares[i].classList.add('taken', shipClass)
                }
                displayGrid.removeChild(draggedShip)
            }
        }
    }

    function taken(start, len, isHorizontal){
        if(isHorizontal){
            for(let i = start; i < start + len; i++){
                if(userSquares[i].classList.contains('taken')){
                    return true
                }
            }
        }else{
            for(let i = start; i < start + len; i += dim){
                if(userSquares[i].classList.contains('taken')){
                    return true
                }
            }
        }
        return false
    }

    let isGameOver = false
    let currentPlayer = 'user'
    let userShipHits = [0, 0, 0, 0, 0]
    let compShipHits = [0, 0, 0, 0, 0]
    let shipsDeadCount = [2, 3, 3, 4, 5]
    let shipIndex = ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier']

    //single player game init function
    function playSingleGame(){
        if(currentPlayer === 'user'){
            turnDisplay.innerHTML = ''
            compSquares.forEach(square => square.addEventListener('click', e => {
                userFire(square)
            }))
        }else{
            turnDisplay.innerHTML = ''
            computerFire()
        }
    }

    function playMultiGame(socket){
        if(isGameOver) return
        
        if(!ready) {
            socket.emit('player-ready')
            ready = true
            playerReady(playerNum)
        } 

        if(enemyReady){
            if(currentPlayer === 'user'){
                turnDisplay.innerHTML = 'Your Turn'
            }
            if(currentPlayer === 'enemy'){
                turnDisplay.innerHTML = 'Enemy Turn'
            }
        }
    }

    function playerReady(num){
        let player = `.player-${parseInt(num) + 1}`
        document.querySelector(`${player} .ready span`).classList.toggle('green')
    }

    //!!!DISABLE DOUBLE CLICK
    function userFire(sqr){
        if(isGameOver) return

        if(sqr.classList.contains('taken')){
            compShipHits[shipIndex.indexOf(sqr.classList[2])]++
            sqr.classList.add('boom')
            console.log(compShipHits)

            compShipHits.forEach((hits, i) => {
                if(hits === shipsDeadCount[i]){
                    infoDisplay.innerHTML = `computer ${shipIndex[i]} sunk`
                }
            })

            if(compShipHits.every((hits, i) => hits === shipsDeadCount[i])){
                infoDisplay.innerHTML = 'computer ships dead'
                isGameOver  = true
            }
        }else{
            sqr.classList.add('miss')
        }
        computerFire()
    }

    function computerFire(){
        if(isGameOver) return

        let firePos = Math.floor(Math.random() * 100)
        console.log(firePos)
        console.log(userSquares[firePos].classList)
        if(userSquares[firePos].classList.contains('boom') || userSquares[firePos].classList.contains('miss')){
            computerFire()
        }else{
            if(userSquares[firePos].classList.contains('taken')){
                userShipHits[shipIndex.indexOf(userSquares[firePos].classList[1])]++
                userSquares[firePos].classList.add('boom')
                console.log(userShipHits)

                if(userShipHits.every((val, index) => val === shipsDeadCount[index])){
                    infoDisplay.innerHTML = 'your ships dead'
                    isGameOver = true
                }
            }else{
                userSquares[firePos].classList.add('miss')
            }
        }
    }
})