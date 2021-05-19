const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const scl = 20
const scrTxt = document.querySelector("#score")
let score;

ctx.scale(scl, scl);

const matrix = [
	[0, 0, 0],
	[1, 1, 1],
	[0, 1, 0]
];

const colors = ["null", "lightblue", "beige", "yellow", "hotpink", "pink", "red", "orange"]
//const colors = ["white", "white", "white", "white", "white", "white", "white", "white"]
function createMatrix(w, h){
	const matrix = []
	while(h--){ 
		matrix.push(new Array(w).fill(0));
	}
	return matrix
}

const arena = createMatrix(17, 27)

const player = {
	matrix: createPiece("T"),
	pos: {x:0, y:0}
}

function collide(arena, player){
	const [m, o] = [player.matrix, player.pos]
	for(let y = 0; y < m.length; ++y){
		for(let x = 0; x < m[y].length; ++x){
			if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false
}

function merge(arena, player){
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				arena[y + player.pos.y][x + player.pos.x] = value
			}
		})
	})
}

function drawMatrix(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0){
				ctx.beginPath()
				ctx.fillStyle = colors[value];
				ctx.strokeStyle = "black";
				ctx.lineWidth = 4/scl;
				ctx.rect(x + offset.x,
				         y + offset.y,
				         1, 1);
				ctx.fill();
				ctx.stroke();
			}
		});
	});
}

function draw(){
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canv.width, canv.height)
	drawMatrix(player.matrix, player.pos)
	drawMatrix(arena, {x:0, y:0})
}

function drawGrid(){
	arena.forEach((row, y) => {
		row.forEach((value, x) => {
				ctx.beginPath()
				ctx.strokeStyle = "black";
				ctx.lineWidth = 0.1/scl;
				ctx.rect(x,
				         y,
				         1, 1);
				ctx.stroke();
		});
	});
}

function playerDrop(){
	player.pos.y++
	if(collide(arena, player)){
		player.pos.y--;
		merge(arena, player);
		resetPlayer();
		checkCompletedRow();
		//drawArena()
	}
	dropCounter = 0 	
}

function playerMove(dir) {
	player.pos.x +=  dir;
	if(collide(arena, player)) {
		player.pos.x -= dir;
	}
}

let dropInterval = 1000
let dropCounter = 0
let lastTime = 0

function update(time = 0){
	const deltaTime = time - lastTime; //every 16 milliseconds it the function is called
	lastTime = time;

	dropCounter += deltaTime

	if(dropCounter >= dropInterval){
		playerDrop()
	}

	draw();
	drawGrid();
	requestAnimationFrame(update)
}

function rotateMatrix() {
	const tempMat = []
	for(let i=0; i < player.matrix.length; i++){
		tempMat[i] = []
		for(let j = player.matrix.length - 1; j >= 0; j--){
			tempMat[i][player.matrix.length - 1 - j] = player.matrix[j][i]
		}
	}
	//set matrix equal to tempMat
	if(collide(arena, {matrix: tempMat, pos: {x: player.pos.x, y: player.pos.y}})){
		return matrix
	}else{
		for(let i = 0; i < player.matrix.length; i++){
			for(let j = player.matrix.length - 1; j >= 0; j--){
				player.matrix[i][player.matrix.length - 1 - j] = tempMat[i][player.matrix.length - 1 - j]
			}
		}
	}
}

function resetPlayer(){
	const pieces = "TOSJLZI"
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
	player.pos.y = 0;
	player.pos.x = (arena[0].length/2 | 0) - (player.matrix[0].length/2 | 0);

	//game over condition
	if(collide(arena, player)){
		arena.forEach(row => {
			row.fill(0)
		})
		score = 0
	}
}

function createPiece(type){
	if(type === "T"){
		return [[0, 0, 0],
				[1, 1, 1],
				[0, 1, 0]]
	}else if(type === "O"){
		return  [[0, 0, 0],
				 [0, 2, 2],
				 [0, 2, 2]]
	}else if(type === "S"){
		return  [[0, 0, 0],
				 [0, 3, 3],
				 [3, 3, 0]]
	}else if(type === "J"){
		return  [[0, 4, 0],
				 [0, 4, 0],
				 [4, 4, 0]]
	}else if(type === "L"){
		return  [[0, 5, 0],
				 [0, 5, 0],
				 [0, 5, 5]]
	}else if(type === "Z"){
		return  [[0, 0, 0],
				 [6, 6, 0],
				 [0, 6, 6]]
	}else if(type === "I"){
		return  [[0, 7, 0, 0],
				 [0, 7, 0, 0],
				 [0, 7, 0, 0],
				 [0, 7, 0, 0]]
	}
}

// function checkCompletedRow() {
// 	let results = []
// 	let combo = 0

// 	for(let i = 0; i < arena.length; i++){
// 			results.push(arena[i].every(val => {
// 			return val >= 1
// 		}))
// 	}
// 	// console.log(results, results.length, arena.length)

// 	//delete rows
// 	for(let i = 0; i < results.length; i++){
// 		if(results[i]){
// 			// for(let j = 0; j < arena[i].length; j++){
// 			// 	arena[i][j] = 0
// 			// }
// 			score++
// 			combo++
// 			// scrTxt.innerHTML = score;
// 			arena[i].fill(0) //delete rows
// 			moveRowsDown(i)
// 		}
// 	}

// 	//flashing animation when combo
// 	if(combo > 2){
// 		flash()
// 	}

// }

function moveRowsDown(index){
	for(let j = index; j > 0; j--){
		arena[j] = arena[j-1]
	}
}

function checkCompletedRow(){
	outer: for(let i = arena.length - 1; i > 0; i--){
		for(let j = 0; j < arena[i].length; j++){
			if(arena[i][j] === 0){
				continue outer
			}
		}

		const row = arena.splice(i, 1)[0].fill(0)
		arena.unshift(row);
		i++
	}
}

//flash when there is a combo
function flash(){

}

resetPlayer()
update() //to initialize the game
document.addEventListener("keydown", e => {
	switch(e.keyCode){
		case 37:
			playerMove(-1)
			break
		case 39:
			playerMove(1)
			break
		case 40:
			playerDrop()
			break
		case 38:
			if(player.matrix !== createPiece("O")){ //NOT WORKING
				rotateMatrix()
			}
			break
	}
})



