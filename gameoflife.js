var namespace = {};

window.onload = function() {  
  init();
};

function init(){
	var i, x, y;

	namespace.size = 64;
	namespace.odds = 0.5;
	namespace.period = 150;
	namespace.running = false;
	namespace.steps = 0;
	
	createTable(namespace.size);

	//creating the population matrix
	namespace.population = new Array (namespace.size);
	for (i = 0; i < namespace.size; i++) {
		namespace.population[i] = new Array (namespace.size);
	}

	//population it with random alive cells
	for (x=0; x<namespace.size; x++){
		for (y=0; y<namespace.size; y++){
			namespace.population[x][y] = !!(Math.random() < namespace.odds);
		}
	}

	//setting the event click
	var stopButton = document.getElementById('stop_button');
	stopButton.addEventListener('click', stopClick, false);
	var playButton = document.getElementById('play_button');
	playButton.addEventListener('click', playClick, false);
	var resetButton = document.getElementById('reset_button');
	resetButton.addEventListener('click', resetClick, false);

	updateTable();
}

function resetClick(){
	stopClick();
	init();
}

function playClick(){
	if (namespace.running === false) {
		namespace.idTimeOut = setInterval(executeNextGeneration, namespace.period);
		namespace.running = true;
		console.log(namespace.idTimeOut);
	}
	
}
function stopClick(){
	window.clearInterval(namespace.idTimeOut);
	namespace.running = false;
}

function executeNextGeneration(){
	var x, y, aliveNeighbours, i;

	var newPopulation = new Array (namespace.size);
	for (i = 0; i < namespace.size; i++) {
		newPopulation[i] = new Array (namespace.size);
	}
	
	for (x=0; x<namespace.size; x++){ //for each cell
		for (y=0; y<namespace.size; y++){
			aliveNeighbours = countAliveNeighbours(x, y);
			if (namespace.population[x][y]){ //is alive
				if (aliveNeighbours === 2 || aliveNeighbours === 3){
					newPopulation[x][y] = true;
				}
				else {
					newPopulation[x][y] = false;
				}
			}
			else { //is dead
				if (aliveNeighbours === 3){
					newPopulation[x][y] = true;
				}
				else {
					newPopulation[x][y] = false;
				}
			}
		}
	}
	namespace.population = newPopulation;

	updateTable();
	updateInfo();
}

function updateInfo(){
	var stepsvalue = document.getElementById('info').firstChild.nextSibling.nextSibling;
	namespace.steps ++;
	stepsvalue.innerHTML = namespace.steps + '';

	var activeCellsValue = document.getElementById('info').firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
	activeCellsValue.innerHTML = '' + countActiveCells();
}

function countActiveCells(){
	var counter = 0, x, y;
	for (x=0; x<namespace.size; x++){
		for (y=0; y<namespace.size; y++){
			if (namespace.population[x][y]){
				counter ++;
			}
		}
	}
	return counter;
}

function countAliveNeighbours(posx, posy){
	var counter = 0;
	var i, j;
	for (i=-1; i<=1; i++){
		for (j=-1; j<=1; j++){
			if (i !== 0 || j !== 0){
				if (namespace.population[posx+i] !== undefined && namespace.population[posx+i][posy+j] !== undefined){
					if (namespace.population[posx+i][posy+j]){
						counter ++;
					}
				}
			}
		}
	}
	return counter;
}

function createTable(){
	var board = document.getElementById('board');
	var x, y, value = '';
	for (x=0; x<namespace.size; x++){ //creates all the div boxes
		for (y=0; y<namespace.size; y++){
			value += '<div id="'+getIdBox(x, y)+'" class="box"></div>';
		}
	}
	board.innerHTML = value;
}

function updateTable(){
	var x, y, box;
	for (x=0; x<namespace.size; x++){ //for each box
		for (y=0; y<namespace.size; y++){
			box = document.getElementById(getIdBox(x,y));
			box.className = (namespace.population[x][y]) ? 'box active' : 'box';
		}
	}
}

function getIdBox(x, y){
	var id = '';
	id = 'box_x'+x+'_y'+y;
	return id;
}