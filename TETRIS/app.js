const canv = document.getElementById("gameCanvas");
const ctx = canv.getContext("2d");
const scl = 20

ctx.scale(scl, scl);

const matrix = [
	[0, 0, 0],
	[1, 1, 1],
	[0, 1, 0]
];

const colors = ["red", "blue", "violet", "yellow", "purple", "pink", "green", "orange"]
function createMatrix(w, h){
	const matrix = []
	while(h--){ //0 is equivalent to false in logical context, hence when h is 0 while loop will stop evaluating
		matrix.push(new Array(w).fill(0));
	}
	return matrix
}

const arena = createMatrix(17, 27)
const player = {
	matrix: createPiece("T"),
	pos: {x:2, y:0}
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
				ctx.lineWidth = 2/scl;
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
		checkSweep();
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

function checkSweep() {
	let results = []
	for(let i = 0; i < arena.length; i++){
			results.push(arena[i].every(val => {
			return val >= 1
		}))
	}
	console.log(results)
}

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
			rotateMatrix()
			break
	}
})



