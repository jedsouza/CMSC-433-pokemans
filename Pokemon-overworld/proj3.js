var fr_num = 0;				//keeps track of frame number of animation the sprite is in
var tID_animate;			//ID used for clearing the animation loop
var tID_layer;
var moving = false;		//lock to ensure proper looping of movement
var img_element;			//used for modifying the image in the div
var div_element;			//used for modifying the div itself
var bg_element;				//used for modifying the background image
var keyPressed = -1;		//keeps track of the active key
var direction;				//0 = left, 1 = up, 2 = right, 3 = down
const MOVE_LIMIT = 31;		//Amount to move per input
var index=0;

var pos = [89,62];			//position array for the character
const MAX_POS = [537,510];	//max value for positions
const MIN_POS = [89,62];	//min value for positions
const X = 0;				//pos[X] is the x coordinate 
const Y = 1;				//pos[Y] is the y coordinate
							
var test_element;
var animating = false;

//Experimental for now, used to add things to the field
//functions for moving them around not implemented yet
var field_elements = [];
var spots = [];
spots["89,62"] = "full";

//adjusts layers of all objects on the field to account for being in front of something
function layering() {
	//get all objects
	let items = document.getElementsByClassName("object");

	for(let j = 0; j < items.length; j++)
	{
		//layer is equal to y coordinate
		console.log(items)
		items[j].style.zIndex = `${items[j].style.top}`;
	}
}

//creates an object with the given characteristics, used for adding things
//onto the field in the game
function Field_element(type, group, width, height, src, x, y){
	if(spots[`{x},${y}`] != "full") {
		var newElem = document.createElement(`${type}`);
		newElem.style = "position:absolute;";
		newElem.style.width = width;
		newElem.style.height = height;
		newElem.dataset.y = y;
		newElem.style.top = y;
		newElem.dataset.x = x;
		newElem.style.left = x;
		newElem.src = src;
		newElem.classList.add(`${group}`);
		newElem.id = `field${index}`;
		newElem.style.zIndex=`${y}`;
		index++;
		spots[`${x},${y}`] = "full";
		document.getElementById('body').appendChild(newElem);
		return newElem;
	}
	else
		return null;
}
	
//adds an item to the field
function add_element(type, group, width, height, src, x, y) {
	x = 89 + 32*x;
	y = 62 + 32*y;
	var newElement = new Field_element(type, group, width, height, src, x, y);
	field_elements.push(newElement);
}

//will be used to detect collision so you can't walk on top of charmander
function against_element(x, y) {
	if(spots[`${x},${y}`] == "full")
		return true;
	else
		return false;
}


				
//direction and fr_num are used to get x coordinate for slicing sprites
//vertical_offset is used to get the y coordinate
function animate() {
	//get the horizontal offset from the array
	var h_offset = fr_num * (63);
	var v_offset = direction * (63);
	//get the image and reslice it
	img_element.style.backgroundPosition = `-${h_offset}px -${v_offset}px`; 
	//update frame counter, 0->1->2->3->0->...
	fr_num = ++fr_num % 4;
}

//sets up movement, determines if background or character moves
function start_move() {
	let coordinate = X;		//defaults to x dimension
	let modifier = 1;		//defaults to positive 
	let no_collision = true;
	//starts animation if necessary
	if(animating == false) {
		animating = true;
		animate();			//does first frame of animation immediately
		tID_animate = setInterval(animate.bind(null), 140);
	}
	
	//change to y dimension if needed
	if (direction == 0 || direction == 3) coordinate = Y;
	//change to positive direction
	if (direction == 1 || direction == 3) modifier = -1;
	

	
	//check for collisions
	if(coordinate == X) {
		if(against_element(pos[0]+modifier*32, pos[1]) == true)
			no_collision = false;
	}
	else if(coordinate == Y) {
		if(against_element(pos[0], pos[1]+modifier*32) == true)
			no_collision = false;
	}
				
			
	
	if(no_collision) {
		//check if move would leave the valid area
		//if it would, move the bacground instead
		let test_value = pos[coordinate] + modifier;
		if(test_value < MIN_POS[coordinate] || test_value > MAX_POS[coordinate]){
			
			for(let i = 0; i < index; i++){
				let element = document.getElementById(`field${i}`);
				delete spots[`${element.dataset.x},${element.dataset.y}`];
			}
			do_move_background(coordinate, modifier*-1, 1, 0);
		} 
		else {
			//do the move for the character
			delete spots[`${pos[0]},${pos[1]}`];
			do_move(coordinate, modifier, 0);
		}
	}
	else{
		
		clearInterval(tID_animate);		
		animating = false;
		moving = false;
		
		//reset frame to 0, draw the frame so character stops on his feet
		fr_num = 0;
		animate();
	}
}

//moves the background instead of the character
function do_move_background(coord, mod, count, offset) {
	

	//find new offset, 1 in the opposite direction of the characters direction
	//mod makes it appear to loop around infinitely
	offset+=mod
	offset = offset%MOVE_LIMIT;
	
	//update the position
	if(coord == Y) {
		bg_img_element.style.backgroundPosition = `0px ${offset}px`;

		//move all field objects along with the background
		for(let i = 0; i < index; i++){
			let element = document.getElementById(`field${i}`);
			let y = parseInt(element.dataset.y) + mod;
			element.dataset.y = y; 
			if(y<656)
				element.style.top = `${y}`;
		}
	}
	else { //(if coord == X)
		bg_img_element.style.backgroundPosition = `${offset}px 0px`; 
		for(let i = 0; i < index; i++){
			let element = document.getElementById(`field${i}`);
			let x = parseInt(element.dataset.x) + mod;
			console.log(x);
			element.dataset.x = x; 
			if(x<656)
				element.style.left = `${x}`;
		}
	}	
	
	//keep moving it until the limit is reached to ensure alignment
	if(count < MOVE_LIMIT) {
		setTimeout(do_move_background.bind(null, coord, mod, count+1, offset),3);
	}
	//when limit is reached, indicate end of movement
	else {
		for(let i = 0; i < index; i++){
			let element = document.getElementById(`field${i}`);
			spots[`${element.dataset.x},${element.dataset.y}`] = "full";
		}
		layering();
		if(keyPressed == -1) {
			clearInterval(tID_animate);		
			animating = false;
			
			//reset frame to 0, draw the frame so character stops on his feet
			fr_num = 0;
			animate();
		}
		moving = false;
	}
		
}


//moves the character
function do_move(coord, mod, steps) {
	//update the stored position
	pos[coord] += mod;
	//update actual position of the image
	div_element.style.left = pos[X] + 'px';
	div_element.style.top = pos[Y] + 'px';
	div_element.style.zIndex = `${pos[Y]}`
	

	if(steps < MOVE_LIMIT) {
		setTimeout(do_move.bind(null, coord, mod, steps+1),3);
	}
	else {
		
		layering();
		spots[`${pos[0]},${pos[1]}`] = "full";
		console.log(spots);
		if(keyPressed == -1) {
			clearInterval(tID_animate);		
			animating = false;
			fr_num = 0;
			animate();
		}
		moving = false;
	}
}



//handles a key being pressed
function handle_input(evt) {
	var key = evt.keyCode;
	//prevent overlapping input, lock function if already animating
	
	//handle new input by saving direction and the offset
	//required for slicing the sprite sheet
	keyPressed = key;
	if (key == 37 || key == 65) {
		vertical_offset = 73;
		direction = 1;
	} else if (key == 38 || key == 87 ) {
		vertical_offset = 199;
		direction = 3;
	} else if (key == 39 || key == 68) {
		vertical_offset = 135;
		direction = 2;
	} else if(key == 40 ||key == 83) {
			vertical_offset = 7;
			direction = 0;
	} else{
		//on invalid key press, indicate no active input
		//and clear out the saved keyPress
		keyPressed = -1;
		return;
	}
    
	
	
	if (moving == false) {
			moving = true;
			start_move();
	}
};

//handles releasing a key
function end_input(evt) {
	//if the key released is the same as the one used to start moving
	
	if(keyPressed == evt.keyCode)
	{

		//clear the stored key press
		keyPressed = -1;
	}
};


//make white rectangles to cover objects outside of the frame
function make_guards() {
	var topGuard = document.createElement("div");
	topGuard.style = "position:fixed;";
	topGuard.style.width = 687;
	topGuard.style.height = 16;
	topGuard.style.top = 0;
	topGuard.style.left = 0;
	topGuard.style.backgroundColor = "white"
	topGuard.id = "topGuard";
	topGuard.style.zIndex="9000";
	document.getElementById('body').appendChild(topGuard);
	var rightGuard = document.createElement("div");
	rightGuard.style = "position:fixed;";
	rightGuard.style.width = window.innerWidth - 687;
	rightGuard.style.height = window.innerHeight;
	rightGuard.style.top = 0;
	rightGuard.style.left = 687;
	rightGuard.style.backgroundColor = "white"
	rightGuard.id = "rightGuard";
	rightGuard.style.zIndex="9000";
	document.getElementById('body').appendChild(rightGuard);
	var leftGuard = document.createElement("div");
	leftGuard.style = "position:fixed;";
	leftGuard.style.width = 687;
	leftGuard.style.height = window.innerHeight - 657;
	leftGuard.style.top = 672;
	leftGuard.style.left = 0;
	leftGuard.style.backgroundColor = "white"
	leftGuard.id = "leftGuard";
	leftGuard.style.zIndex="9000";
	document.getElementById('body').appendChild(leftGuard);
}

//resize the white rectangles, called when window is resized
function resize() {
	rightGuard.style.width = window.innerWidth - 687;
	rightGuard.style.height = window.innerHeight;
	leftGuard.style.height = window.innerHeight - 657;
}

//runs on load
function startUp()
{
	//store element references for quick access
	test_element = document.getElementById("test");
	img_element = document.getElementById("sprite");
	div_element = document.getElementById("sprite_holder");
	bg_img_element = document.getElementById("grass");
	make_guards();
	//add listeners for required events
	window.addEventListener('keydown', handle_input);
	window.addEventListener('keyup', end_input);
	window.addEventListener('resize', resize);
	
	//adds some charmanders to the field for testing purposes
	add_element("img", "object", 57, 60, "004Charmander.png", 4, 3);
	//add_element("img", "object", 57, 60, "004Charmander.png", 5, 1);
	//add_element("img", "object", 57, 60, "004Charmander.png", -5, 0);
}