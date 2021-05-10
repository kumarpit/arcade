document.addEventListener("DOMContentLoaded", () => {
	const squares = document.querySelectorAll(".grid div")
	const displayScore = document.querySelector(".score")
	let width = 15
	let currentIndex = 0
	let foodIndex = 0
	let currentSnake = [1,0] 
	let direction = 0
	let score = 0
	let speed = 0.9
	let intervalTime = 200
	let interval = 0

	function startGame(){
		currentSnake.forEach(snake => squares[snake].classList.remove("snake"))
		currentSnake = [1,0]
		squares[foodIndex].classList.remove("food")
		clearInterval(interval)
		score = 0
		randomFood()
		direction = 0
		displayScore.textContent = score
		currentIndex = 0
		currentSnake.forEach(snake => squares[snake].classList.add("snake"))
		interval = setInterval(checkMoveOutcomes, intervalTime)
	}

	function control(e){
		if (e.keyCode === 37){
			direction = -1
		}else if (e.keyCode === 38){
			direction = -width
		}else if (e.keyCode === 39){
			direction = 1
		}else if (e.keyCode === 40){
			direction = +width
		}else if(e.keyCode === 32){
			startGame()
		}
	}

	function checkMoveOutcomes(){
		if (direction != 0){
			if ((currentSnake[0] + width >= (width*width) && direction === width) ||
				(currentSnake[0] - width < 0 && direction === -width) ||
				(currentSnake[0] % width === width - 1 && direction === 1) ||
				(currentSnake[0] % width === 0 && direction === -1) ||
				(squares[currentSnake[0] + direction].classList.contains("snake"))){
					return clearInterval(interval)
			}

			const tail = currentSnake.pop()
			squares[tail].classList.remove("snake")
			currentSnake.unshift(currentSnake[0] + direction)

		if (squares[currentSnake[0]].classList.contains("food")){
				squares[tail].classList.add("snake")
				currentSnake.push(tail)
				randomFood()
				score++
				displayScore.textContent = score
				// clearInterval(interval)
				// intervalTime *= speed
				// interval = setInterval(checkMoveOutcomes, interval)
			}
			squares[currentSnake[0]].classList.add("snake")
		}
	}


	function randomFood(){
		squares[foodIndex].classList.remove("food")
		do{
			foodIndex = Math.floor(Math.random()*squares.length)
		}while(squares[foodIndex].classList.contains("snake"))

		squares[foodIndex].classList.add("food")
	}

	document.addEventListener("keyup", control)

})