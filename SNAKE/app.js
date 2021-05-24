const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const scl = 25;
const fps = 5; 
let food;

//define classes
class Snake{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.body = [{x: this.x, y: this.y}];
		this.dir = {
			x: 0,
			y: 0
		};
	}
	setDir(xdir, ydir){
		this.dir.x = xdir;
		this.dir.y = ydir;
	}
	drawSnake(){
		ctx.fillStyle = "black";
		this.body.forEach(el => {
			ctx.fillRect(el.x, el.y, scl, scl);
		})
	}
	moveSnake(){
		let len = this.body.length;
		if(len == 1){
			this.body[0].x += this.dir.x;
			this.body[0].y += this.dir.y;
		}else{
			let newx = this.body[len-1].x + this.dir.x;
			let newy = this.body[len-1].y + this.dir.y;
			this.body.push({x: newx, y:newy});
			this.body.shift();
		}

		console.log(this.body[len-1])
	}
	eatsFood(foodPos){ //this function is broken
		let len = this.body.length;
		let x = this.body[len-1].x + this.dir.x;
		let y = this.body[len-1].y + this.dir.y;
		let fx = foodPos.x * scl; 
		let fy = foodPos.y * scl;
		if(x == fx &&  y == fy){
			createFood();
			this.grow();
			return true;
		}
		return false;
	}
	grow(){
		let x = this.body[0].x - this.dir.x;
		let y = this.body[0].y - this.dir.y;
		this.body.unshift({x: x, y: y});
	}
	dead(){
		//dead conditions
	}
}

function createFood(){
	let x = Math.random() * (canv.width / scl)  | 0;
	let y = Math.random() * (canv.height / scl) | 0;
	food = {x: x, y: y}
	console.log(food.x * scl, food.y * scl);
}

function drawFood(){
	ctx.fillStyle = "rgb(255,0,100)";
	ctx.fillRect(food.x*scl, food.y*scl, scl, scl);
}

let lastTime = 0;
let deltaTime = 0;
let countTime = 0;
let interval = 1000 / fps;

//main game loop
function update(time){
	if(time){
		deltaTime = time - lastTime;
		countTime += deltaTime;
		lastTime = time;
	}

	if(countTime > interval){
		ctx.clearRect(0, 0, canv.width, canv.height);
		snake.moveSnake();
		snake.drawSnake();
		drawFood();
		snake.eatsFood(food)
		countTime = 0;
	}

	requestAnimationFrame(update)
}

//initialise game
let snake = new Snake(0, 0);
createFood();

document.addEventListener("keydown", e =>{
	switch(e.keyCode){
		case 37:
			snake.setDir(-scl, 0);
			break;
		case 38:
			snake.setDir(0, -scl);
			break;
		case 39:
			snake.setDir(scl, 0);
			break;
		case 40:
			snake.setDir(0, scl);
			break;
	};
});

window.requestAnimationFrame(update);