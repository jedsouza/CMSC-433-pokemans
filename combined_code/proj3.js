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
var spots = [];
spots["89,62"] = "full";

//adjusts layers of all objects on the field to account for being in front of something
//adjusts layers of all objects on the field to account for being in front of something
function layering() {
	//get all objectss
	let items = document.getElementsByClassName("object");

	for(let j = 0; j < items.length; j++)
	{
		//layer is equal to y coordinate
		// console.log(items)
		items[j].style.zIndex = 5;
	}
}
///creates an object with the given characteristics, used for adding things
//onto the field in the game
function Field_element(type, group, width, height, src, x, y, id){
	console.log("id: ", `${x},${y}`)
	if(spots[`${x},${y}`] != "full") {
		var newElem = document.createElement(`${type}`);
		newElem.style = "position:absolute;";
		newElem.style.width = width;
		newElem.style.height = height;
		
		newElem.dataset.y = y;
		if (x <= 656)
			newElem.style.top = y;
		else
			newElem.style.top = 656;
		
		newElem.dataset.x = x;
		if (x <= 656)
			newElem.style.left = x;
		else
			newElem.style.left = 656;
		
		newElem.src = src;
		newElem.classList.add(`${group}`);
		newElem.poke_id = id;
		newElem.id = `field${index}`;
		newElem.style.zIndex=5;
		index++;
		spots[`${x},${y}`] = "full";
		document.getElementById('Test').appendChild(newElem);
		return newElem;
	}
	else
		return null;
}
	
//adds an item to the field
function add_element(type, group, width, height, src, x, y, id) {
	x = 89 + 32*x;
	y = 62 + 32*y;
	var newElement = new Field_element(type, group, width, height, src, x, y, id);
	field_elements.push(newElement);
}

//will be used to detect collision so you can't walk on top of charmander
function against_element(x, y, id) {
	// console.log("x:",x," y:",y, " id:",id)
	
	for (var ctr = 0; ctr < enemies.length; ctr++) {
		// console.log(enemies[ctr]["x"] - 30,(enemies[ctr]["y"] - 30))
		if (enemies[ctr]["id"] == id) {
			console.log("hit! " + enemies[ctr]["id"] , ":", enemies[ctr]["xp"])
			saveEnemy(enemies[ctr]["id"], enemies[ctr]["xp"])
		}
	}
}

function betterCollisionDetection(x, y){
	console.log("check! ", spots[`${x},${y}`] )
	if(spots[`${x},${y}`] == "full"){
		console.log("Got it! ", x, y)
		let poke = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
		return against_element(x,y, poke.poke_id);
	}
	else
		return false;
}

function saveEnemy(num, xp) {

	enemy_id = 1
	console.log("enter:" + num)
	send_id = []
	send_id.push(num)
	$.ajax({
		type: "POST",  //type of method
		url: "php/send_enemy.php",  //your page
		data: { enemy_id: enemy_id, poke_id: send_id, xp: xp },// passing the values
		success: function (res) {
			console.log("success")             //do what you want here...
			console.log(res)
		}
	});

	location.replace("http://localhost/project3/new_battle.html")
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
		if(betterCollisionDetection(pos[0]+modifier*32, pos[1]) == true)
			no_collision = false;
	}
	else if(coordinate == Y) {
		if(betterCollisionDetection(pos[0], pos[1]+modifier*32) == true)
			no_collision = false;
	}
				
			
	
	if(no_collision) {
		//check if move would leave the valid area
		//if it would, move the bacground instead
		let test_value = pos[coordinate] + modifier;
		// console.log(spots)
		if (test_value < MIN_POS[coordinate] || test_value > MAX_POS[coordinate]) {

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

function move_field_elements(coord, mod) 
{        
    if(coord == Y) {
        for(let i = 0; i < index; i++){
            let element = document.getElementById(`field${i}`);
            let y = parseInt(element.dataset.y) + mod;
            element.dataset.y = y; 
            if(y<=656)
                element.style.top = `${y}`;
        }
    }
    else {
        for(let i = 0; i < index; i++){
            let element = document.getElementById(`field${i}`);
            let x = parseInt(element.dataset.x) + mod;
            element.dataset.x = x; 
            if(x<=656)
                element.style.left = `${x}`;
        }
    }
}

//moves the background instead of the character
function do_move_background(coord, mod, count, offset) {
    
    //find new offset, 1 in the opposite direction of the characters direction
    //mod makes it appear to loop around infinitely
    offset+=mod;
    offset = offset%MOVE_LIMIT;
    //update the position
    if(coord == Y) 
         bg_img_element.style.backgroundPosition = `0px ${offset}px`;
    
    else bg_img_element.style.backgroundPosition = `${offset}px 0px`;     
    
    move_field_elements(coord, mod);
    
    //keep moving it until the limit is reached to ensure alignment
    if(count < MOVE_LIMIT) {
        setTimeout(do_move_background.bind(null, coord, mod, count+1, offset),3);
    }
    //when limit is reached, indicate end of movement
    else {
        move_field_elements(coord, mod);
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
	div_element.style.zIndex = 5
	

	if(steps < MOVE_LIMIT) {
		setTimeout(do_move.bind(null, coord, mod, steps+1),3);
	}
	else {
		
		layering();
		spots[`${pos[0]},${pos[1]}`] = "full";
		// console.log(spots);
		if(keyPressed == -1) {
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
	topGuard.style.zIndex="9000";
	document.getElementById('Test').appendChild(topGuard);
	var rightGuard = document.createElement("div");
	rightGuard.style = "position:fixed;";
	rightGuard.style.width = window.innerWidth - 687;
	rightGuard.style.height = window.innerHeight;
	rightGuard.style.top = 0;
	rightGuard.style.left = 687;
	rightGuard.style.backgroundColor = "white"
	rightGuard.id = "rightGuard";
	rightGuard.style.zIndex="9000";
	document.getElementById('Test').appendChild(rightGuard);
	var leftGuard = document.createElement("div");
	leftGuard.style = "position:fixed;";
	leftGuard.style.width = 687;
	leftGuard.style.height = window.innerHeight - 657;
	leftGuard.style.top = 672;
	leftGuard.style.left = 0;
	leftGuard.style.backgroundColor = "white"
	leftGuard.id = "leftGuard";
	leftGuard.style.zIndex="9000";
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

	myTutorial = document.getElementById("tutorial-overlay");
    myTutorial.innerHTML = "Welcome to Team Rocket rookie!";    
	document.getElementById("tutorial-overlay").style.display = "block";
	timeOut = setTimeout(function thatFunction(){myTutorial.innerHTML = "We are an elite organization that performs covert operations which the governemnt is too afraid to pursue "; document.getElementById("tutorial-overlay").style.display = "block";},4000);
	timeOut = setTimeout(function thatFunction(){myTutorial.innerHTML = "Your mission today is to kill as many of the dangerous pokemon here as you can, for which you will be handsomely rewarded"; document.getElementById("tutorial-overlay").style.display = "block";},8000);
	timeOut = setTimeout(function thatFunction(){myTutorial.innerHTML = "As long as you don't ask any questions ofcourse"; document.getElementById("tutorial-overlay").style.display = "block";},12000);
	timeOut = setTimeout(function thatFunction(){myTutorial.innerHTML = "to move use w,a,s,d or the arrow keys"; document.getElementById("tutorial-overlay").style.display = "block";},16000);
    timeOut = setTimeout(function thatFunction(){myTutorial.innerHTML = "press 'y' to view Pokemon"; document.getElementById("tutorial-overlay").style.display = "block";},20000);
	timeOut = setTimeout(function tutorialFunct(){document.getElementById("tutorial-overlay").style.display = "none";},24000);
	
	//add listeners for required events
	window.addEventListener('keydown', handle_input);
	window.addEventListener('keyup', end_input);
	window.addEventListener('resize', resize);

	
	
}

function addPokemonToMap(x,y,num, xp){
	// console.log("x: ", x, " y: ", y)
	// console.log("xp: ", xp)
	add_element("img", "object", 57, 60, "poke_front/poke_"+ num +".png", x, y, num);
	enemies.push({"x":x, "y": y, "id": num, "xp": xp})
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
	num = Math.random()
	// console.log("enter: " + num )
	var spawnChance = .75;	// 5% spawn chance
	if(num < spawnChance) {
		// console.log("enter2")
		// choose random tile 5 tiles away for spawning
		// var offsets = [[3,4], [4,3], [0,5], [5,0]];
		var offsetDirections = [1, -1];

		// var chosenOffset = offsets[Math.floor(Math.random() * 5)];
		
		num1 = Math.floor(Math.random() * 2)
		num2 = Math.floor(Math.random() * 2)

		test_x = (Math.floor( Math.random() * 7 + 3))
		test_y = (Math.floor( Math.random() * 7 + 3))
		console.log(test_x, ":" , test_y)
		x_pos = test_x * offsetDirections[num1]
		y_pos = test_x *  offsetDirections[num2]
		// console.log(chosenOffset[X] + ":" + chosenOffset[Y])
		// chosenOffset[0] *= offsetDirections[num1];
		// chosenOffset[1] *= offsetDirections[num2];
		// console.log("offset x: " + chosenOffset[X]  +" offset y: " + chosenOffset[Y] )

		// add pokemon based on randomly calculated offset from player above (currently set to be 0 - 2 levels above average level of user's pokemon)
		addPokemonToMap(x_pos , y_pos, Math.floor(Math.random() * 151) + 1, getAvgLvl() + Math.floor(Math.random() * 3));
		// console.log([x_pos,y_pos])
		
	}
}


//************************************************************************* */
//in game menu code

player_id = []
poke_id = []
xp = []
hp = []
currPlayer = []
currPlayer_id = []
money = []
currMoney = -1

collectTeam("php/player.php")

// collectTeam("php/player_poke.php")

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

	// next_pos = []
	// next_pos = spawn_enemy(0, 0)

	for(ctr = 0; ctr < 20; ctr++){
		
		spawn_enemy()
	}
}

function createInit(list) {
	console.log("check2")

	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(",")
		// console.log(word[1])
		p_pos = currPlayer.indexOf("1")
		// console.log("p_pos: " + p_pos)
		if (word[0] == currPlayer_id[p_pos]) {
			player_id.push(word[0])
			poke_id.push(word[1])
			// console.log(word[2], ":", word[3])
			hp.push(word[2])
			xp.push(word[3])
			console.log("money: ", money[p_pos])
			currMoney = money[p_pos]
		}
	}

	document.getElementById("info").innerHTML += currMoney;
	// console.log("money: " + currMoney)
	collectTeam("php/poke.php")
}

function getCurrPlayer(list){
	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(",")
		// console.log(word)

		currPlayer_id.push(word[0]) 
		currPlayer.push(word[3]) 
		money.push(word[2])
	}
	collectTeam("php/player_poke.php")
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
			else if(url == "php/player.php"){
				getCurrPlayer(list)
			}
			else {
				toAdd(list)
			}


		}

	};
	theRequest.open("GET", url, true);
	theRequest.send();
}