const FPS = 30 //FRAME RATE
const canv = document.getElementById("gameCanvas")
const ctx = canv.getContext("2d")
const SHIP_SIZE = 30 //in px
const ROTATE_SPEED = 360; //deg per second
const SHIP_THRUST = 5 //pixels per second
const FRICTION = 0.7 //friction coeff of space
const ASTEROIDS_NUM = 5 //will be increased as the game gets more and more difficult
const ASTEROID_SPEED = 40 // px per second
const ROIDS_VERT = 10 //avg number of vertices
const ROIDS_SIZE = 100 //asteroids will start with this size
const ROIDS_JAG = 0.4 //0 is not at all jagged, 1 is lots
const SHOW_COLLISION_BOUNDING = false //shows circle around every element on the screen
const COLLISION_ROTATION_SPEED = 25
const SHIP_IMMUNE_DURATON = 3
const SHIP_BLINK_DURATION = 0.1
const LASER_MAX = 10 //max num of lasers on the screen at one time
const LASER_SPEED = 500 //px per second
const LASER_RADIUS = 2
const SAVE_KEY = "highscore"
const LASER_MAX_DIST = 0.6 //maximum distance a laser can travel
const TEXT_FADE_TIME = 1.5
const TEXT_SIZE = 30
const LIVES = 3
const ROIDS_POINT_LRG = 20
const ROIDS_POINT_MED = 50
const ROIDS_POINT_SMALL = 100
let score 

// let lasers = []
let interval = 0
let pause = false

let level = 1
let asteroids, ship, text, textAlpha, lives, highScore
newGame()


//defining keyup and keydown seperately allows for press and hold to keep rotating
document.addEventListener("keydown", keydown)
document.addEventListener("keyup", keyup)

//set up game loop
//interval = setInterval(update, 1000/FPS)
let lastTime = 0
let deltaTime = 0
let countTime = 0
let frameInterval = 1000/FPS | 0
window.requestAnimationFrame(update)

function keydown(e){
	if(ship.dead){
		return
	}

	switch(e.keyCode){
		case 37:
			ship.rot = ROTATE_SPEED/180*Math.PI/FPS
			break
		case 39:
			ship.rot = -ROTATE_SPEED/180*Math.PI/FPS
			break
		case 38:
			ship.thrusting = true
			break
		case 32:
			if(!pause){
				shootLaser()
			}
			break
		case 80:
			if(!pause){
				pause = true
			}else{
				pause = false
				window.requestAnimationFrame(update)
			}
	}	
}

function keyup(e){ //STOP ROTATING
	if(ship.dead){
		return
	}

	switch(e.keyCode){
		case 37:
			ship.rot = 0
			break
		case 39:
			ship.rot = 0
			break
		case 38:
			ship.thrusting = false
			break
		case 32:
			ship.canShoot = true
			break
	}	
}

function newAsteroid(x,y,r){
	let lvlMult = 1 + 0.1*level
	let roid ={
		x: x,
		y: y,
		xv: Math.random()*ASTEROID_SPEED*lvlMult/FPS*(Math.random() < 0.5? 1 : -1) + 1,
		yv: Math.random()*ASTEROID_SPEED*lvlMult/FPS*(Math.random() < 0.5? 1 : -1) + 1,
		r: r,
		a: Math.random()*2*Math.PI, // convert to radians
		vert: Math.floor(Math.random()*(ROIDS_VERT + 1) + ROIDS_VERT/2),
		offs: []
	}

	//create vertex offset
	for(let i=0; i<roid.vert; i++){
		roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG) 
	}
	return roid;
}

function createAsteroidBelt(){
	asteroids = []
	let x,y
	for(let i=0; i < ASTEROIDS_NUM + level; i++){
		do{
			//random location not touching spaceship
			x = Math.floor(Math.random()*canv.width);
			y = Math.floor(Math.random()*canv.height);
		}while(distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE*1.5 + ship.r)
		asteroids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/2)))
	}
}

function destroyAsteroid(index){
	let x = asteroids[index].x;
	let y = asteroids[index].y;
	let r = asteroids[index].r;

	//split the asteroid in two if not small
	if(r == Math.ceil(ROIDS_SIZE/2)){
		asteroids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/4)))
		asteroids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/4)))
		score += ROIDS_POINT_LRG
	} else if(r == Math.ceil(ROIDS_SIZE/4)){
		asteroids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/8)))
		asteroids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE/8)))
		score += ROIDS_POINT_MED
	}else{
		score += ROIDS_POINT_SMALL
	}

	//destroy the original asteroid
	asteroids.splice(index, 1)
	
	//check highScore with current score
	if(score > highScore){
		highScore = score
		localStorage.setItem(SAVE_KEY, highScore)
	}

	if(asteroids.length === 0){
		level++
		console.log(level)
		setTimeout(newLevel,500)
	}
}

function distBetweenPoints(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function explodeShip(){
	ship = newShip()
	
}

function newGame(){
	//level = 1
	lives = LIVES
	score = 0
	ship = newShip()
	newLevel()
	//createAsteroidBelt() call inside create asteroid

	let scoreStr = localStorage.getItem(SAVE_KEY)
	if(scoreStr == null){
		highScore = 0
	}else{
		highScore = parseInt(scoreStr)
	}
}

function newLevel(){
	text = "LEVEL " + level
	textAlpha = 1.0
	createAsteroidBelt()
}

function newShip(){
	return {
		x: canv.width / 2,
		y: canv.height / 2,
		r: SHIP_SIZE / 2, //r is radius
		a: 90/180*Math.PI, //which angle the ship is pointing, IN RAD {unit circle}
		rot:0,
		thrusting: false,
		thrust: {
			x: 0,
			y: 0
		},
		dead: false,
		blinkTime: Math.ceil(SHIP_BLINK_DURATION*FPS), //blink duration = 0.1, every three frames one blink
		blinkNum: Math.ceil(SHIP_IMMUNE_DURATON/SHIP_BLINK_DURATION), //immune duration = 2, 20 blinks
		canShoot: true,
		lasers: []
	}
}

function shootLaser(){
	//create laser object
	if(ship.canShoot && ship.lasers.length < LASER_MAX){
		ship.lasers.push({
			x: ship.x + 4/3*ship.r*Math.cos(ship.a),
			y: ship.y - 4/3*ship.r*Math.sin(ship.a),
			xv: LASER_SPEED * Math.cos(ship.a) / FPS,
			yv: LASER_SPEED * Math.sin(ship.a) / FPS,
			dist: 0
		})
	}

	//allow only one shot per key press
	ship.canShoot = false
}

function gameOver(){
	ship.dead = true
	text = "GAME OVER"
	textAlpha = 1.0
}

function update(time){
	if(time){
		deltaTime = time - lastTime
		countTime += deltaTime
		lastTime = time
	}

	if(countTime > frameInterval){
		countTime = 0
		let blinkOn = ship.blinkNum % 2 === 0
		//draw space/bg
		ctx.fillStyle = "black"; //everytime we update, we drawing new canvas over the old one hence no need to erase stuff drawn previously
		ctx.fillRect(0, 0, canv.width, canv.height);

		//draw ship (TRIANGULAR)
		if(blinkOn && !ship.dead){
			ctx.strokeStyle = "white";
			ctx.lineWidth = SHIP_SIZE/8;
			ctx.beginPath();
			ctx.moveTo( //tip of the ship
				ship.x + 4/3*ship.r*Math.cos(ship.a),
				ship.y - 4/3*ship.r*Math.sin(ship.a)
				);
			ctx.lineTo( //rear left of the ship
				ship.x - ship.r*(2/3*Math.cos(ship.a) + Math.sin(ship.a)),
				ship.y + ship.r*(2/3*Math.sin(ship.a) - Math.cos(ship.a))
				);
			ctx.lineTo( //rear right of the ship
				ship.x - ship.r*(2/3*Math.cos(ship.a) - Math.sin(ship.a)),
				ship.y + ship.r*(2/3*Math.sin(ship.a) + Math.cos(ship.a))
				);
			ctx.closePath();
			ctx.stroke();
		}

		if(ship.blinkNum > 0){
			ship.blinkTime --
			if(ship.blinkTime == 0){ //handles frames
				ship.blinkTime = Math.ceil(SHIP_BLINK_DURATION*FPS)
				ship.blinkNum --
			}
		}

		//draw lasers
		for(let i=0; i < ship.lasers.length; i++){
			ctx.fillStyle = "white"
			ctx.beginPath()
			ctx.arc(
				ship.lasers[i].x,
				ship.lasers[i].y,
				LASER_RADIUS,
				0,
				2*Math.PI)
			ctx.fill()
		}

		//handle laser edge conditions

		//draw asteroids
		let x,y,xv,yv,r,a,vert,offs

		for(let i=0; i < asteroids.length; i++){
			ctx.strokeStyle = "white"
			ctx.lineWidth = SHIP_SIZE/8
			x = asteroids[i].x
			y = asteroids[i].y
			xv = asteroids[i].xv
			yv = asteroids[i].yv
			r = asteroids[i].r
			a = asteroids[i].a
			vert = asteroids[i].vert
			offs = asteroids[i].offs

			//draw path
			ctx.beginPath()
			ctx.moveTo(
				x + r * offs[0] * Math.cos(a),
				y + r * offs[0] * Math.sin(a)
				)

			//draw polygon
			for(let j=1; j < vert; j++){
				ctx.lineTo(
					x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
					y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
					)
			}
			ctx.closePath();
			ctx.stroke();

			if(SHOW_COLLISION_BOUNDING){
				ctx.strokeStyle = "blue"
				ctx.beginPath()
				ctx.arc(x,y,r,0,2*Math.PI)
				ctx.stroke()
			}
		}

		//check for collision before movement
		for(let i=0; i < asteroids.length; i++){
			if(distBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.r + asteroids[i].r && ship.blinkNum === 0 && !ship.dead){
				//clearInterval(interval)
				destroyAsteroid(i)
				lives--
				if(lives === 0){
					gameOver()
				}else{
					explodeShip()
				}
			}
		}

		//laser hits asteroids
		for(let i = asteroids.length - 1; i >= 0; i--){

			for(let j = ship.lasers.length - 1; j >= 0; j--){

				if(distBetweenPoints(ship.lasers[j].x, ship.lasers[j].y, asteroids[i].x, asteroids[i].y) < asteroids[i].r){
					//remove the laser
					ship.lasers.splice(j, 1)

					//destroy asteroid/ break it down 
					destroyAsteroid(i)
					break;
				}
			}
		}

		//rotate ship
		ship.a += ship.rot

		//thrusting?
		if(ship.thrusting && !ship.dead){
			ship.thrust.x += SHIP_THRUST*Math.cos(ship.a)/FPS;
			ship.thrust.y -= SHIP_THRUST*Math.sin(ship.a)/FPS;
			//draw thruster
			//ctx.fillStyle = "white"
			if(blinkOn && !ship.dead){
				ctx.strokeStyle = "white";
				ctx.lineWidth = SHIP_SIZE/8;
				ctx.beginPath();
				ctx.moveTo( //rear left
					ship.x - ship.r*(2/3*Math.cos(ship.a) + 0.5*Math.sin(ship.a)),
					ship.y + ship.r*(2/3*Math.sin(ship.a) - 0.5*Math.cos(ship.a))
					);
				ctx.lineTo( //rear centre behind
					ship.x - ship.r*(6/3*Math.cos(ship.a)),
					ship.y + ship.r*(6/3*Math.sin(ship.a))
					);
				ctx.lineTo( //rear right of the ship
					ship.x - ship.r*(2/3*Math.cos(ship.a) - 0.5*Math.sin(ship.a)),
					ship.y + ship.r*(2/3*Math.sin(ship.a) + 0.5*Math.cos(ship.a))
					);
				ctx.closePath();
				//ctx.fill();
				ctx.stroke();
			}
		}else{
			ship.thrust.x -= FRICTION * ship.thrust.x /FPS 
			ship.thrust.y -= FRICTION * ship.thrust.y /FPS
		}

		if(SHOW_COLLISION_BOUNDING){
			ctx.strokeStyle = "blue"
			ctx.beginPath()
			ctx.arc(ship.x,ship.y,ship.r,0,2*Math.PI)
			ctx.stroke()
		}

		//draw level text
		if(textAlpha >= 0){
			//ctx.beginPath()
			ctx.textAlign = "center"
			ctx.textBaseLine = "middle"
			ctx.fillStyle = "rgba(0,0,0, " + textAlpha + ")";
			ctx.font = "normal " + 	TEXT_SIZE + "px Arial";
			ctx.fillText(text, canv.width/2, SHIP_SIZE)
			textAlpha -= (1.0/TEXT_FADE_TIME/FPS)
		}
		// else if(ship.dead){
		// 	newGame()
		// }

		//draw lives
		for(let i=0; i < lives; i++){
			let x = SHIP_SIZE + i * SHIP_SIZE * 1.3
			let y = SHIP_SIZE
			let r = 15
			let a = 90/180*Math.PI
			ctx.strokeStyle = "white";
			ctx.lineWidth = 30/8;
			ctx.beginPath();
			ctx.moveTo( //tip of the ship
				x + 4/3*r*Math.cos(a),
				y - 4/3*r*Math.sin(a)
				);
			ctx.lineTo( //rear left of the ship
				x - r*(2/3*Math.cos(a) + Math.sin(a)),
				y + r*(2/3*Math.sin(a) - Math.cos(a))
				);
			ctx.lineTo( //rear right of the ship
				x - r*(2/3*Math.cos(a) - Math.sin(a)),
				y + r*(2/3*Math.sin(a) + Math.cos(a))
				);
			ctx.closePath();
			ctx.stroke();
		}

		//draw the score
		ctx.beginPath()
		ctx.textAlign = "right"
		ctx.textBaseLine = "middle"
		ctx.fillStyle = "white"
		ctx.font = "normal " + TEXT_SIZE*1 + "px 'Press Start 2P'";
		ctx.fillText(score, canv.width - SHIP_SIZE/2, SHIP_SIZE + 15)

		//draw highScore
		// ctx.beginPath()
		// ctx.textAlign = "center"
		// ctx.textBaseLine = "middle"
		// ctx.fillStyle = "black"
		// ctx.font = TEXT_SIZE*0.9 + "px monospace";
		// ctx.fillText("BEST " +highScore, canv.width/2, SHIP_SIZE)
		

		//move ship
		ship.x += ship.thrust.x
		ship.y += ship.thrust.y
		
		//move lasers
		for(let i= ship.lasers.length - 1; i >= 0; i--){ //have to go in the opposite direction you are splicing cause the indexes change
			
			//check distance travlled
			if(ship.lasers[i].dist > LASER_MAX_DIST*canv.width){
				ship.lasers.splice(i, 1)
				continue
			}

			//move the laser
			ship.lasers[i].x += ship.lasers[i].xv
			ship.lasers[i].y -= ship.lasers[i].yv

			//calculate distance travlled
			ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv,2) + Math.pow(ship.lasers[i].yv, 2))

			if(ship.lasers[i].x > canv.width + LASER_RADIUS){
				ship.lasers[i].x = 0 - LASER_RADIUS
			}else if(ship.lasers[i].x < 0 - LASER_RADIUS){
				ship.lasers[i].x = canv.width + LASER_RADIUS
			}

			if(ship.lasers[i].y < 0 - LASER_RADIUS){
				ship.lasers[i].y = canv.height + LASER_RADIUS
			}else if(ship.lasers[i].y > canv.height + LASER_RADIUS){
				ship.lasers[i].y = 0 - LASER_RADIUS
			}
		}

		for(let i=0; i < asteroids.length; i++){
			//move the asteroids
			asteroids[i].x += asteroids[i].xv
			asteroids[i].y += asteroids[i].yv

			// handle the edge of the screen
			if(asteroids[i].x > canv.width + asteroids[i].r){
				asteroids[i].x = 0 - asteroids[i].r
			}else if(asteroids[i].x < 0 - asteroids[i].r){
				asteroids[i].x = canv.width + asteroids[i].r
			}

			if(asteroids[i].y < 0 - asteroids[i].r){
				asteroids[i].y = canv.height + asteroids[i].r
			}else if(asteroids[i].y > canv.height + asteroids[i].r){
				asteroids[i].y = 0 - asteroids[i].r
			}
		}

		//handle edge conditions, in this game the shooter is supposed to be able to wrap/warp through the edges
		if(ship.x > canv.width + ship.r){
			ship.x = 0 - ship.r
		}else if(ship.x < 0 - ship.r){
			ship.x = canv.width + ship.r
		}

		if(ship.y < 0 - ship.r){
			ship.y = canv.height + ship.r
		}else if(ship.y > canv.height + ship.r){
			ship.y = 0 - ship.r
		}
	}

	if(!pause){
		requestAnimationFrame(update)
	}
}






