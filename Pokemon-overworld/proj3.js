var fr_num = 0;				//keeps track of frame number of animation the sprite is in
var tID_animate;			//ID used for clearing the animation loop
var moving = false;		//lock to ensure proper looping of movement
var img_element;			//used for modifying the image in the div
var div_element;			//used for modifying the div itself
var bg_element;				//used for modifying the background image
var keyPressed = -1;		//keeps track of the active key
var direction;				//0 = left, 1 = up, 2 = right, 3 = down
const MOVE_LIMIT = 31;		//Amount to move per input


var pos = [89,62];			//position array for the character
const MAX_POS = [537,510];	//max value for positions
const MIN_POS = [89,62];	//min value for positions
const X = 0;				//pos[X] is the x coordinate 
const Y = 1;				//pos[Y] is the y coordinate
							
var test_element;
var animating = false;
/*
//Experimental for now, used to add things to the field
//functions for moving them around not implemented yet
var field_elements = [];

function Field_element(width, height, src){
	this.newDiv = document.createElement("img")
	this.newDiv.style = "position:absolute;";
	this.newDiv.style.width = width;
	this.newDiv.style.height = height;
	this.newDiv.src = src;
}
	
function add_Element(width, height, src) {
	var newElement = new Field_element(width, height, src);
	field_elements.push(newElement);
}

function against_element(coord, mod) {}
*/

				
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
	
	//check if move would leave the valid area
	//if it would, move the bacground instead
	let test_value = pos[coordinate] + modifier;
	if(test_value < MIN_POS[coordinate] || test_value > MAX_POS[coordinate]){
		setTimeout(do_move_background.bind(null, coordinate, modifier*-1, 1, 0),3)
	} 
	else {
		//do the move for the character
		do_move(coordinate, modifier, 0);
	}
}

//moves the background instead of the character
function do_move_background(coord, mod, count, offset) {
	
	//find new offset, 1 in the opposite direction of the characters direction
	//mod makes it appear to loop around infinitely
	offset+=mod
	offset = offset%MOVE_LIMIT;
	
	//update the position
	if(coord == Y)
		bg_img_element.style.backgroundPosition = `0px ${offset}px`; 
	else //(if coord == X)
		bg_img_element.style.backgroundPosition = `${offset}px 0px`; 
	
	//keep moving it until the limit is reached to ensure alignment
	if(count < MOVE_LIMIT) {
		setTimeout(do_move_background.bind(null, coord, mod, count+1, offset),3);
	}
	//when limit is reached, indicate end of movement
	else {
		if(keyPressed == -1) {
			clearInterval(tID_animate);		
			animating = false;
			fr_num = 0;
			animate();
			fr_num = 0;
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
	if(steps < MOVE_LIMIT) {
		setTimeout(do_move.bind(null, coord, mod, steps+1),3);
	}
	else {
		if(keyPressed == -1) {
			clearInterval(tID_animate);		
			animating = false;
			fr_num = 0;
			animate();
			fr_num = 0;
		}
		moving = false;
	}
}



//handles a key being pressed
function handle_input(evt) {
	var key = evt.keyCode;
	//prevent overlapping input, lock function if already animating
	if(keyPressed == -1) 
	{
		
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

//runs on load
function startUp()
{
	//store element references for quick access
	test_element = document.getElementById("test");
	img_element = document.getElementById("sprite");
	div_element = document.getElementById("sprite_holder");
	bg_img_element = document.getElementById("grass");
	
	//add listeners for required events
	window.addEventListener('keydown', handle_input);
	window.addEventListener('keyup', end_input);	
}