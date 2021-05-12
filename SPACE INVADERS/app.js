const canv = document.getElementById("gameCanvas")
const ctx = canv.getContext("2d")
const FPS = 30
const scl = 50
const starNum = 170
let dir = 0
let xdir = 0
let ydir = 0
let adir = 5
let frames = 0
let width = 9
let height = 3
let currX = 100
let aliens = []
let lasers = []
let alienLasers = []
let starsPos = []
let ship

class Alien{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.imgObj = new Image();
		this.imgObj.src = "alien.png";
	}

	drawAlien(){
		ctx.drawImage(this.imgObj, this.x, this.y);
	}
}

let ex = new Alien(0, 0)

class Ship{
	constructor(x){
		this.imgObj = new Image();
		this.imgObj.src = "ship.png"
		this.x = x
		this.y = canv.height - 42
	}

	drawShip(){
		ctx.drawImage(this.imgObj, this.x, this.y)
	}
}

class Laser{
	constructor(x, y){
		this.x = x
		this.y = y
		this.width = 4
		this.height = 25
		this.speed = 10
	}

	drawLaser(){
		ctx.fillStyle = "white"
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	moveLaser(){
		this.y -= this.speed
	}

}

class AlienLaser{
	constructor(x, y){
		this.x = x
		this.y = y
		this.height = 15
		this.width = 5
		this.speed = 10
	}

	drawLaser(){
		ctx.fillStyle = "white"
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	moveLaser(){
		this.y += this.speed
	}
}

function createAlienGrid(h, w){
	for(let i = 0; i < h; i++){
		aliens[i] = []
		for(let j = 0; j < w; j++){
			aliens[i][j] = 1 //if there is a one, draw aliens
		}
	}
}

function shootLaser() {
	lasers.push(new Laser(ship.x + ship.imgObj.width/2 | 0, ship.y - ship.imgObj.height/2 | 0))
}

function keyDownCtr(e){
	switch(e.keyCode){
		case 37:
			dir = -10
			currX += dir
			break
		case 39:
			dir = 10
			currX += dir
			break
		case 32:
			if(lasers.length === 0){
				shootLaser()
			}
			break
	}
}

function showAliens() {
	aliens.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value == 1){
				let alien = new Alien(x*scl + xdir, y*scl + ydir)
				alien.drawAlien()
			}
		})
	}) 
}

function dropLasers(){
	let x = Math.random() * width | 0
	let y = Math.random() * height | 0
	if(aliens[y][x] != 0){
		alienLasers.push(new AlienLaser(x * scl + xdir + ex.imgObj.width / 2 | 0, 
			                            y * scl + ydir))
	}
}

function checkEdges(){
	let rightEdge = width*scl + scl + xdir > canv.width;
	let leftEdge = xdir <= 0

	if (rightEdge && adir === 5){
		adir = 0
		ydir += 10
		console.log("down")

	}else if (leftEdge && adir === -5){
		adir = 0
		ydir += 10
		console.log("down")

	}else if (ydir > 0){

		if (leftEdge){
			adir = 5
		}else if (rightEdge){
			adir = -5
		}
	}

	xdir += adir
}

function collide(aliens, lasers){
	aliens.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value === 1){
				lasers.forEach((laser, i) => {
					if(laser.x > x*scl + xdir && 
						laser.x + laser.width < x*scl + ex.imgObj.width + xdir &&
						laser.y > y*scl &&
						laser.y + laser.height < y*scl + ydir + ex.imgObj.height){

						aliens[y][x] = 0
						lasers.splice(i, 1)
						return
					}
				})
			}
		})
	})
}

function outOfBounds(lasers){
	lasers.forEach((laser, i) => {
		if(laser.y < 0){
			lasers.splice(i, 1)
		}else if(laser.y > canv.height){
			lasers.splice(i, 1)
		}
	})
}	

function deadShip(ship, al){
	al.forEach((laser, i) => {
		if(laser.x > ship.x && 
		   laser.x + laser.width < ship.x + ship.imgObj.width &&
		   laser.y > ship.y && 
		   laser.y + laser.height < ship.y + ship.imgObj.height){
			console.log("ship hit")
			return
		}
	})
}

function makeStars(){
	for(let i=0; i < starsPos.length; i++){
		ctx.beginPath()
		ctx.fillStyle = "white"
		ctx.fillRect(starsPos[i].x, starsPos[i].y, starsPos[i].r, starsPos[i].r)
	}
}

function fillPos(){
	for(let i=0; i < starNum; i++){
		let x = Math.random() * canv.width | 0
		let y = Math.random() * canv.height | 0
		let r = Math.random() * 3 | 0
		starsPos[i] = {x: x, y:y, r:r}
	}
}

//function bullet collide to see if alien bullet and player bullet have collided
	
function update(){
	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, canv.width, canv.height)
	makeStars()
	ship = new Ship(currX)
	ship.drawShip()
	showAliens()
	lasers.forEach(laser => {
		laser.drawLaser()
		laser.moveLaser()
	})
	collide(aliens, lasers)
	outOfBounds(lasers)
		
	if(frames == 20){
		checkEdges() //returns xdir and ydir
		frames = 0
	}

	alienLasers.forEach(al => {
		al.drawLaser()
		al.moveLaser()
	})

	deadShip(ship, alienLasers)
	outOfBounds(alienLasers)

	frames++
}

//initialize game
createAlienGrid(height, width)
document.addEventListener("keydown", keyDownCtr)
fillPos()
update()
setInterval(update, 1000/FPS)
setInterval(dropLasers, 20000/FPS)


	