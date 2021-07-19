const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const scl = 25;
const fps = 10; 
let food;
let score = document.getElementById('score')

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
		ctx.fillStyle = "deepskyblue"
		this.body.forEach(el => {
			ctx.fillRect(el.x, el.y, scl, scl);
		})
	}
	moveSnake(){
		let len = this.body.length;
		let newx = this.body[len-1].x + this.dir.x;
		let newy = this.body[len-1].y + this.dir.y;
		if(len == 1){
			if(!this.dead({x: newx, y: newy})){
				this.body[0].x += this.dir.x;
				this.body[0].y += this.dir.y;
			}
		}else{
			if(!this.dead({x: newx, y: newy})){
				this.body.push({x: newx, y: newy});
				this.body.shift();
			}
		}
	}
	eatsFood(foodPos){
		let len = this.body.length;
		let x = this.body[len-1].x + this.dir.x;
		let y = this.body[len-1].y + this.dir.y;
		let fx = foodPos.x * scl; 
		let fy = foodPos.y * scl;
		if(x == fx &&  y == fy){
			createFood();
			this.grow();
			score.innerHTML = this.body.length - 1
			return true;
		}
		return false;
	}
	grow(){
		let x = this.body[0].x;
		let y = this.body[0].y;
		this.body.unshift({x: x, y: y}); //adding a duplicate tail
	}
	dead(newPos){
		if (newPos.x > canv.width - scl ||
			newPos.x < 0 ||
			newPos.y > canv.height - scl ||
			newPos.y < 0 || 
			this.runIntoSelf(newPos)){

			return true;
		}

		return false;
	}
	runIntoSelf(newPos){
		for(let cell of this.body){
			if(cell.x == newPos.x && cell.y == newPos.y){
				return true
			}
		}
		return false;
	}
}

function createFood(){
	let fx = Math.floor(Math.random() * (canv.width / scl));
	let fy = Math.floor(Math.random() * (canv.height / scl));
	
	for(let cell of snake.body){
		if(cell.x === fx * scl && cell.y === fy * scl){
			return createFood()
		}
	}
	
	food = {x: fx, y: fy};
}

function drawFood(){
	ctx.fillStyle = "red"
	ctx.fillRect(food.x * scl, food.y * scl, scl, scl);
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
		snake.eatsFood(food);
		snake.moveSnake();
		snake.drawSnake();
		drawFood();

		countTime = 0;
	}
	requestAnimationFrame(update)
}

//initialise game
let snake = new Snake(0, 0);
createFood();

//desktops keyboard control
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


//--------------------------------------------------------------------------

//mobile touch controls
// document.addEventListener('touchstart', handleTouchStart, false);        
// document.addEventListener('touchmove', handleTouchMove, false);

// var xDown = null;                                                        
// var yDown = null;                                                        

// function getTouches(evt) {
// 	return evt.touches
// }

// function handleTouchStart(evt) {  
// 	const firstTouch = getTouches(evt)[0];                                       
//     xDown = firstTouch.clientX;                                      
//     yDown = firstTouch.clientY;                                      
// };                                                

// function handleTouchMove(evt) {
//     if ( ! xDown || ! yDown ) {
//         return;
//     }

//     var xUp = evt.touches[0].clientX;                                    
//     var yUp = evt.touches[0].clientY;

//     var xDiff = xDown - xUp;
//     var yDiff = yDown - yUp;

//     if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
//         if ( xDiff > 0 ) {
//             snake.setDir(-scl, 0)
//         } else {
//             snake.setDir(scl, 0)
//         }                       
//     } else {
//         if ( yDiff > 0 ) {
//             snake.setDir(0, -scl)
//         } else { 
//             snake.setDir(0, scl)
//         }                                                                 
//     }
//     /* reset values */
//     xDown = null;
//     yDown = null;                                             
// };