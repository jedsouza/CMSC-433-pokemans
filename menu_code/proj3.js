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
var index = 0;

var pos = [89, 62];			//position array for the character
const MAX_POS = [537, 510];	//max value for positions
const MIN_POS = [89, 62];	//min value for positions
const X = 0;				//pos[X] is the x coordinate 
const Y = 1;				//pos[Y] is the y coordinate

var test_element;
var animating = false;

var field_elements = [];

//************ */

var enemies = []

var lock = 0

//Experimental for now, used to add things to the field
//functions for moving them around not implemented yet
var field_elements = [];

//adjusts layers of all objects on the field to account for being in front of something
function layering() {
	//get all objects
	let items = document.getElementsByClassName("object");

	for (let j = 0; j < items.length; j++) {
		//layer is equal to y coordinate
		items[j].style.zIndex = `${items[j].style.top}`;
	}
}

//creates an object with the given characteristics, used for adding things
//onto the field in the game
function Field_element(type, group, width, height, src, x, y) {
	var newElem = document.createElement(`${type}`);
	newElem.style = "position:absolute;";
	newElem.style.width = width;
	newElem.style.height = height;
	newElem.style.top = y;
	newElem.style.left = x;
	newElem.src = src;
	newElem.classList.add(`${group}`);
	newElem.id = `field${index}`;
	newElem.style.zIndex = `${y}`;
	index++;
	document.getElementById('Test').appendChild(newElem);
}

//adds an item to the field
function add_element(type, group, width, height, src, x, y) {
	var newElement = new Field_element(type, group, width, height, src, x, y);
	field_elements.push(newElement);
}

//will be used to detect collision so you can't walk on top of charmander
function against_element(x, y) {
	// console.log("x:",x," y:",y)

	for (var ctr = 0; ctr < enemies.length; ctr++) {
		// console.log(enemies[ctr]["x"] - 30,(enemies[ctr]["y"] - 30))
		if (x > (enemies[ctr]["x"] - 30) && x < (enemies[ctr]["x"] + 30) & y > (enemies[ctr]["y"] - 30) && y < (enemies[ctr]["y"] + 30)) {
			console.log("hit! " + enemies[ctr]["id"])
			saveEnemy(enemies[ctr]["id"], enemies[ctr]["xp"])
		}
	}
}

function saveEnemy(num, xp) {

	enemy_id = 1
	console.log("enter!" + num)

	$.ajax({
		type: "POST",  //type of method
		url: "php/send_enemy.php",  //your page
		data: { enemy_id: enemy_id, poke_id: num, xp: xp },// passing the values
		success: function (res) {
			console.log("success")             //do what you want here...
			// $("#change").html(res);
		}
	});

	location.replace("new_battle.html")
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

	//starts animation if necessary
	if (animating == false) {
		
		animating = true;
		animate();			//does first frame of animation immediately
		tID_animate = setInterval(animate.bind(null), 140);
	}

	//change to y dimension if needed
	if (direction == 0 || direction == 3) coordinate = Y;
	//change to positive direction
	if (direction == 1 || direction == 3) modifier = -1;

	//check if move would leave the valid area
	//if it would, move the background instead
	let test_value = pos[coordinate] + modifier;
	if (test_value < MIN_POS[coordinate] || test_value > MAX_POS[coordinate]) {
		do_move_background(coordinate, modifier * -1, 1, 0);
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
	offset += mod
	offset = offset % MOVE_LIMIT;

	//update the position
	if (coord == Y) {
		bg_img_element.style.backgroundPosition = `0px ${offset}px`;

		//move all field objects along with the background
		for (let i = 0; i < index; i++) {
			let element = document.getElementById(`field${i}`);
			let y = parseInt(element.style.top) + mod;
			element.style.top = `${y}`;
		}
	}
	else { //(if coord == X)
		bg_img_element.style.backgroundPosition = `${offset}px 0px`;
		for (let i = 0; i < index; i++) {
			let element = document.getElementById(`field${i}`);
			let x = parseInt(element.style.left) + mod;
			element.style.left = `${x}`;
		}
	}

	//keep moving it until the limit is reached to ensure alignment
	if (count < MOVE_LIMIT) {
		setTimeout(do_move_background.bind(null, coord, mod, count + 1, offset), 3);
	}
	//when limit is reached, indicate end of movement
	else {
		if (keyPressed == -1) {
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

	against_element(pos[X], pos[Y])

	layering();
	if (steps < MOVE_LIMIT) {
		setTimeout(do_move.bind(null, coord, mod, steps + 1), 3);
	}
	else {
		if (keyPressed == -1) {
			console.log("enter here!")
			clearInterval(tID_animate);
			animating = false;
			fr_num = 0;
			animate();
		}
		moving = false;
	}
}

ctr = 0

//handles a key being pressed
function handle_input(evt) {
	var key = evt.keyCode;
	//prevent overlapping input, lock function if already animating
	if (keyPressed == -1) {

		//handle new input by saving direction and the offset
		//required for slicing the sprite sheet
		keyPressed = key;
		if (key == 37 || key == 65) {
			vertical_offset = 73;
			direction = 1;
		} else if (key == 38 || key == 87) {
			vertical_offset = 199;
			direction = 3;
		} else if (key == 39 || key == 68) {
			vertical_offset = 135;
			direction = 2;
		} else if (key == 40 || key == 83) {
			vertical_offset = 7;
			direction = 0;
		}
		else if (key == 89) {
			if (ctr % 2 == 0) {
				document.getElementById("mySidenav").style.width = "250px";
			}
			else {
				document.getElementById("mySidenav").style.width = "0";
			}
			ctr++
			keyPressed = -1;
			return;
		} 
		else {
			//on invalid key press, indicate no active input
			//and clear out the saved keyPress
			keyPressed = -1;
			return;
		}

	}

	if (moving == false) {

		moving = true;
		start_move();

		// random chance of enemy spawning on each tile walked
		spawn_enemy();
	}
};

//handles releasing a key
function end_input(evt) {
	//if the key released is the same as the one used to start moving

	if (keyPressed == evt.keyCode) {
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
	topGuard.style.zIndex = "9000";
	document.getElementById('Test').appendChild(topGuard);
	var rightGuard = document.createElement("div");
	rightGuard.style = "position:fixed;";
	rightGuard.style.width = window.innerWidth - 687;
	rightGuard.style.height = window.innerHeight;
	rightGuard.style.top = 0;
	rightGuard.style.left = 687;
	rightGuard.style.backgroundColor = "white"
	rightGuard.id = "rightGuard";
	rightGuard.style.zIndex = "9000";
	document.getElementById('Test').appendChild(rightGuard);
	var leftGuard = document.createElement("div");
	leftGuard.style = "position:fixed;";
	leftGuard.style.width = 687;
	leftGuard.style.height = window.innerHeight - 657;
	leftGuard.style.top = 672;
	leftGuard.style.left = 0;
	leftGuard.style.backgroundColor = "white"
	leftGuard.id = "leftGuard";
	leftGuard.style.zIndex = "9000";
	document.getElementById('Test').appendChild(leftGuard);
}

//resize the white rectangles, called when window is resized
function resize() {
	rightGuard.style.width = window.innerWidth - 687;
	rightGuard.style.height = window.innerHeight;
	leftGuard.style.height = window.innerHeight - 657;
}

//runs on load
function startUp() {
	//store element references for quick access
	test_element = document.getElementById("test");
	img_element = document.getElementById("sprite");
	div_element = document.getElementById("sprite_holder");
	bg_img_element = document.getElementById("grass");
	make_guards();
	window.alert("to move use w,a,s,d or the arrow keys");
	window.alert("the 'y' key displays your selected pokemon including their health");
	//add listeners for required events
	window.addEventListener('keydown', handle_input);
	window.addEventListener('keyup', end_input);
	window.addEventListener('resize', resize);

	//adds some charmanders to the field for testing purposes
	// add_element("img", "object", 57, 60, "poke_front/poke_4.png", 185, 150);
	// add_element("img", "object", 57, 60, "poke_front/poke_4.png", 217, 119);
	// addPokemonToMap(50,50,6)
	// addPokemonToMap(185,150,7)



	addPokemonToMap(217,119,8, 1)

}

function addPokemonToMap(x,y,num, xp){
	add_element("img", "object", 57, 60, "poke_front/poke_"+ num +".png", x, y);
	enemies.push({"x":x, "y": y, "id": num, "xp": xp});
}

function getAvgLvl() {
	var numAlivePoke = 0;
	var totalLvl = 0;
	for(var i = 0; i < 6; i++) {
		if(parseInt(hp[i]) > 0) {
			numAlivePoke += 1;
			totalLvl += parseInt(xp[i]);
		}
	}
	return Math.floor(totalLvl / numAlivePoke);
}

// function to randomly spawn enemy pokemon near player
function spawn_enemy() {
	var spawnChance = .05;	// 5% spawn chance
	if(Math.random() < spawnChance) {
		// choose random tile 5 tiles away for spawning
		var offsets = [[3,4], [4,3], [0,5], [5,0]];
		var offsetDirections = [1, -1];

		var chosenOffset = offsets[Math.floor(Math.random() * 4)];
		chosenOffset[X] *= offsetDirections[Math.floor(Math.random() * 2)];
		chosenOffset[Y] *= offsetDirections[Math.floor(Math.random() * 2)];

		// add pokemon based on randomly calculated offset from player above (currently set to be 0 - 2 levels above average level of user's pokemon)
		addPokemonToMap(MOVE_LIMIT * chosenOffset[X] + pos[X], MOVE_LIMIT * chosenOffset[Y] + pos[Y], Math.floor(Math.random() * 151) + 1, getAvgLvl() + Math.floor(Math.random() * 3));
	}
}

//************************************************************************* */
//in game menu code

player_id = []
poke_id = []
xp = []
hp = []

collectTeam("php/player_poke.php")


function createPokeM(img, name, type1, type2, total, hp, attack, defence, spA, spD, speed, xp, ctr) {
	// console.log("check5: " + )
	toAdd = '<div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Type 1 <br /> </p>                <p class="name">' + type1 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Typ 2 <br /> </p>                <p class="name">' + type2 + '  <br /> </p>            </div>           <div class="desc">                <p class="title">HP <br /> </p>                <p class="name">' + hp + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Attack <br /> </p>                <p class="name">' + attack + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Defence <br /> </p>                <p class="name">' + defence + '  <br /> </p>            </div>   <div class="desc">                <p class="title">XP <br /> </p>                <p class="name">' + xp + '  <br /> </p>            </div>      </div>'
	document.getElementById("mySidenav").innerHTML += toAdd
}

function toAdd(list) {
	// console.log(hp)
	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(" ")
		poke_pos = poke_id.indexOf(word[0])

		if (poke_pos >= 0) {
			// console.log("poke_pos: " + xp[poke_pos])
			createPokeM("poke_front/poke_" + (ctr + 1) + ".png", word[1], word[2], word[3], word[4], hp[poke_pos], word[6], word[7], word[8], word[9], word[10], xp[poke_pos], ctr + 1)
			// console.log("added: " + word[0])
		}

	}
}

function createInit(list) {
	console.log("check2")

	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(",")
		console.log(word[1])
		player_id.push(word[0])
		poke_id.push(word[1])
		console.log(word[2], ":", word[3])
		hp.push(word[2])
		xp.push(word[3])
	}

	collectTeam("php/poke.php")
}

function collectTeam(url) {
	list = ""

	var theRequest = new XMLHttpRequest();

	theRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// document.getElementById("change").innerHTML += "Complete";
			console.log("check1")
			list = this.responseText;
			list = list.split("\n")
			if (url == "php/player_poke.php") {
				createInit(list)
			}
			else {
				toAdd(list)
			}


		}

	};
	theRequest.open("GET", url, true);
	theRequest.send();
}