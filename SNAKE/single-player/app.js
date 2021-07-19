const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const scl = 25;
const fps = 5; 
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
		ctx.fillStyle = "blue"
		this.body.forEach(el => {
			ctx.fillRect(el.x, el.y, scl, scl);
		})
	}
	moveSnake(){
		let len = this.body.length;
		let headx = this.body[len-1].x + this.dir.x;
		let heady = this.body[len-1].y + this.dir.y;
		if(len == 1){
			if(!this.dead({x: headx, y: heady})){
				this.body[0].x += this.dir.x;
				this.body[0].y += this.dir.y;
			}
		}else{
			let newx = this.body[len-1].x + this.dir.x;
			let newy = this.body[len-1].y + this.dir.y;
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
		this.body.unshift({x: x, y: y});
	}
	dead(head){
		if(head.x > canv.width - scl || head.x < 0 || head.y > canv.height - scl || head.y < 0 || this.runIntoSelf(head)){
			return true;
		}
		return false;
	}
	runIntoSelf(head){
		for(let i = 0; i < this.body.length - 1; i++){
			if(head.x == this.body[i].x && head.y == this.body[i].y){
				return true;
			}
		}
		return false;
	}
}

function createFood(){
	let x, y;
	do{
		x = Math.random() * (canv.width / scl)  | 0;
		y = Math.random() * (canv.height / scl) | 0;
	}while(snake.body.forEach(el => {
		if(x == el.x && y == el.y){
			return true;
		}
	}));
	food = {x: x, y: y};
}

function drawFood(){
	ctx.fillStyle = "red"
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