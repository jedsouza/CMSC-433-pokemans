var fr_num = 0;				//keeps track of frame number of animation the sprite is in
var tID_animate;			//ID used for clearing the animation loop
var active_input = false;	//lock to prevent multiple inputs at once	
var moving = false;		//lock to ensure proper looping of movement
var img_element;			//used for modifying the image in the div
var div_element;			//used for modifying the div itself
var bg_element;				//used for modifying the background image
var keyPressed = -1;		//keeps track of the active key
var direction;				//0 = left, 1 = up, 2 = right, 3 = down
const MOVE_LIMIT = 62;		//Amount to move per input


var pos = [89,62];			//position array for the character
const MAX_POS = [537,510];	//max value for positions
const MIN_POS = [89,62];	//min value for positions
const X = 0;				//pos[X] is the x coordinate 
const Y = 1;				//pos[Y] is the y coordinate
					
var animating = false;


				
//direction and fr_num are used to get x coordinate for slicing sprites
//vertical_offset is used to get the y coordinate
function animate() {
	//get the horizontal offset from the array
	var h_offset = fr_num * (MOVE_LIMIT+1);
	var v_offset = direction * (MOVE_LIMIT+1);
	//get the image and reslice it
	img_element.style.backgroundPosition = `-${h_offset}px -${v_offset}px`; 
	//update frame counter, 0->1->2->3->0->...
	fr_num = ++fr_num % 4;
}

//coordinate is the index in the position array
//modifier is how much to change it by
function start_move() {
	let coordinate = X;		//defaults to x dimension
	let modifier = 1;		//defaults to positive 
	
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
		//do the move
		do_move(coordinate, modifier, 0);
	}
}

//moves the background instead of the character
function do_move_background(coord, mod, count, offset) {
	
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
	if(steps <= MOVE_LIMIT) {
		setTimeout(do_move.bind(null, coord, mod, steps+1),3);
	}
	else {
		moving = false;
	}
}



//handles a key being pressed
function handle_input(evt) {
	var key = evt.keyCode;
	//prevent overlapping input, lock function if already animating
	if(active_input == false) 
	{
		active_input = true;					//indicate animation has started
		
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
		} else {
			//on invalid key press, indicate no active input
			//and clear out the saved keyPress
			active_input = 0;
			keyPressed = -1;
			return;
		}
		fr_num = 0;
		//animate();
		tID_animate = setInterval(animate.bind(null), 140);
		animating = true;
	}
	if (moving == false) {		
		//keep frame but redraw in new direction
		//fr_num--;
		//animate();
		
		moving = true;
		start_move();
	}
};

//handles releasing a key
function end_input(evt) {
	//if the key released is the same as the one used to start moving
	if(keyPressed == evt.keyCode)
	{
		keyPressed = -1;
		clearInterval(tID_animate);		
		animating = false;
		fr_num = 0;
		animate();
		//indicate that the sprite is inactive
		active_input = 0;
		//clear the stored key press
	}
};

//runs on load
function startUp()
{
	//store element references for quick access
	img_element = document.getElementById("sprite");
	div_element = document.getElementById("sprite_holder");
	bg_img_element = document.getElementById("grass");
	//add listeners for required events
	window.addEventListener('keydown', handle_input);
	window.addEventListener('keyup', end_input);	
}