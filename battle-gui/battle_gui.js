
const OPP_HBAR_XMIN = 141;
const OPP_HBAR_XMAX = 289;
const PLYR_HBAR_XMIN = 377;
const PLYR_HBAR_XMAX = 526;
const HP_BAR_WIDTH = 149;
var PLYR_POKE;
var OPP_POKE;
var anim_flag = 4;

//called by show_damage, moves left edge of the white bar to
//cover opponent's hp bar, looks like hp draining.
function adjust_opp_hp_bar(loops, max_loops, mod, bar) {
	let x = parseInt(bar.style.left);
	let w = parseInt(bar.style.width);
	x -= mod;
	w += mod;
	//do max_loops iterations unless 100% full or empty reached
	if(loops < max_loops && x >= OPP_HBAR_XMIN && x<= OPP_HBAR_XMAX) {
		bar.style.left = `${x}`;
		bar.style.width = `${w}`;
		setTimeout(adjust_opp_hp_bar.bind(null,loops+1,max_loops, mod, bar),3);
	}
}

//called by show_damage, moves left edge of the white bar to
//cover player's hp bar, looks like hp draining
function adjust_plyr_hp_bar(loops, max_loops, mod, bar) {
	let x = parseInt(bar.style.left);
	let w = parseInt(bar.style.width);
	x -= mod;
	w += mod;
	if(loops < max_loops && x >= PLYR_HBAR_XMIN && x<= PLYR_HBAR_XMAX) {	
		bar.style.left = `${x}`;
		bar.style.width = `${w}`;
		setTimeout(adjust_plyr_hp_bar.bind(null,loops+1,max_loops, mod, bar),3);
	}
}
	
//takes in percent of damage done as a float (55% damage = .55)
//player == true means player takes damage
//player == false means computer takes damage
//mod is the amount to adjust the bar
//bar is the element to be adjusted
function show_damage(percent, player) {
	
	let mod;
	//positive percent is damage, negative is healing
	if(percent>=0) {
		mod = 1; //bar widens by 1 pixel 
		max_loops = parseInt(percent * HP_BAR_WIDTH);
	}
	else{
		mod = -1; //bar narrows by 1 pixel
		max_loops = parseInt(-1 * percent * HP_BAR_WIDTH);
	}
	
	let bar;
	//if showing damage on the computer
	if(player == false) {
		bar = document.getElementById("OPP_HBAR_Cover");
		adjust_opp_hp_bar(0, max_loops, mod, bar);
	} else /*if showing damage on the player*/ { 
		bar = document.getElementById("PLYR_HBAR_Cover");
		adjust_plyr_hp_bar(0, max_loops, mod, bar);
	}
}

//percent is the percent of hp remaining on the pokemon swapping in
//player is same as above, 1 for player and 0 for computer
function swap_hp_bar(percent, player) {
	if(player == false) {
		bar = document.getElementById("OPP_HBAR_Cover");
		bar.style.left = OPP_HBAR_XMIN;
		bar.style.width = HP_BAR_WIDTH;
	} else {
		bar = document.getElementById("PLYR_HBAR_Cover");
		bar.style.left = PLYR_HBAR_XMIN;
		bar.style.width = HP_BAR_WIDTH;
	}
	setTimeout(show_damage.bind(null, -percent, player), 1000);
}

//poke is an element holding the pokemon to move
//steps is how many steps have been taken, should be 1 on first call
//steps_to_take is how many steps to taken
//time per step is how long each takes
//distance per step is how far each step goes (negative for left/up)
//dim is the dimension, 0 = x, 1 = y
function move(poke, steps, steps_to_take, d_per_step, t_per_step, dim) {
	if(dim == "x")
		poke.style.left = `${parseInt(poke.style.left) + d_per_step}`;
	else
		poke.style.top = `${parseInt(poke.style.top) + d_per_step}`;
	
	if(steps <= steps_to_take){
		setTimeout(move.bind(null, poke, steps+1, steps_to_take, 
					              d_per_step, t_per_step, dim), t_per_step);
	}
}

//same as before, dim replaced with quadrant
//number of the quadrant = direction to move towards, relative to object position
function move_diagonal(poke, steps, steps_to_take, d_per_step, t_per_step, quadrant) {
	if(quadrant == 1) {
		poke.style.top = `${parseInt(poke.style.top) - d_per_step}`;
		poke.style.left = `${parseInt(poke.style.left) + d_per_step}`;
	}
	else if(quadrant == 2) {
		poke.style.top = `${parseInt(poke.style.top) - d_per_step}`;
		poke.style.left = `${parseInt(poke.style.left) - d_per_step}`;
	}
	else if(quadrant == 3) {
		poke.style.top = `${parseInt(poke.style.top) + d_per_step}`;
		poke.style.left = `${parseInt(poke.style.left) - d_per_step}`;
	}
	else if(quadrant == 4) {
		poke.style.top = `${parseInt(poke.style.top) + d_per_step}`;
		poke.style.left = `${parseInt(poke.style.left) + d_per_step}`;
	}
	
	if(steps <= steps_to_take){
		setTimeout(move_diagonal.bind(null, poke, steps+1, steps_to_take, 
					              d_per_step, t_per_step, quadrant), t_per_step);
	}
}

//animation to swap out opponent pokemon, called by swap_opp_poke
function withdraw_opp_animation_loop(loops, id) {
	let poke = document.getElementById("OPP_POKE");
	
	//shrink and go up and right
	if(loops < 24){
		poke.style.top = `${parseInt(poke.style.top) - 1}`;
		poke.style.left = `${parseInt(poke.style.left) + 4}`;
		poke.style.width = `${96 - loops * 4}px`;
		poke.style.height = 'auto';
		setTimeout(withdraw_opp_animation_loop.bind(null, loops+1, id), 10);
	}
	//switch to new sprite
	else if(loops == 24) {
		poke.src = `poke_front/poke_${id}.png`;
		setTimeout(withdraw_opp_animation_loop.bind(null, loops+1, id), 500);
	}
	//expand, go down and left
	else if(loops <= 48) {
		poke.style.top = `${parseInt(poke.style.top) + 1}`;
		poke.style.left = `${parseInt(poke.style.left) - 4}`;
		poke.style.width = `${4 + (loops - 24) * 4}px`;
		poke.style.height = 'auto';
		setTimeout(withdraw_opp_animation_loop.bind(null, loops+1, id), 10);
	}
}

//same as above, different direction
function withdraw_plyr_animation_loop(loops, id) {
	let poke = document.getElementById("PLYR_POKE");
	if(loops < 24){
		poke.style.top = `${parseInt(poke.style.top) - 1}`;
		poke.style.left = `${parseInt(poke.style.left) - 4}`;
		poke.style.width = `${96 - loops * 4}px`;
		poke.style.height = 'auto';
		setTimeout(withdraw_plyr_animation_loop.bind(null, loops+1, id), 10);
	}
	else if(loops == 24) {
		poke.src = `poke_back/poke_${id}.png`;
		setTimeout(withdraw_plyr_animation_loop.bind(null, loops+1, id), 500);
	}
	else if(loops <= 48) {
		
		poke.style.top = `${parseInt(poke.style.top) + 1}`;
		poke.style.left = `${parseInt(poke.style.left) + 4}`;
		poke.style.width = `${4 + (loops - 24) * 4}px`;
		poke.style.height = 'auto';
		setTimeout(withdraw_plyr_animation_loop.bind(null, loops+1, id), 10);
	}
}

//does the player attack animation
function player_attack_animation_loop() {
	let poke = document.getElementById("PLYR_POKE");
	move(poke, 1, 10, 2, 3, "x");
	setTimeout(move.bind(null, poke, 1, 50, 1, 1, "x"),31);
	setTimeout(move.bind(null, poke, 1, 50, -1, 1, "x"),82);
	setTimeout(move.bind(null, poke, 1, 10, -2, 3, "x"),133);
}

//does the player hit animation
function player_hit_animation_loop() {
	let poke = document.getElementById("PLYR_POKE");
	move_diagonal(poke, 1, 25, 2, 1, 3);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 1), 100);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 3), 200);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 2, 1, 1), 300);
}

//does the animation for opponent's attack
function opponent_attack_animation_loop() {
	let poke = document.getElementById("OPP_POKE");
	move(poke, 1, 10, -2, 3, "x");
	setTimeout(move.bind(null, poke, 1, 50, -1, 1, "x"),31);
	setTimeout(move.bind(null, poke, 1, 50, 1, 1, "x"),82);
	setTimeout(move.bind(null, poke, 1, 10, 2, 3, "x"),133);
}

//does the animation for the opponent getting hit
function opponent_hit_animation_loop() {
	let poke = document.getElementById("OPP_POKE");
	move_diagonal(poke, 1, 25, 2, 1, 1);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 3), 100);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 1), 200);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 2, 1, 3), 300);
}



function player_death_animation(id){
	let tomb = document.getElementById("tomb");
	tomb.style.left = "150px";
	if(parseInt(tomb.style.top) < -80) {
		tomb.style.top = `${parseInt(tomb.style.top) + 1}`;
		setTimeout(player_death_animation.bind(null), 1);
	}	
	else if(parseInt(tomb.style.top) < -50) {
		tomb.style.top = `${parseInt(tomb.style.top) + 3}`;
		setTimeout(player_death_animation.bind(null), 1);
	}	
	else if(parseInt(tomb.style.top) < 200) {
		tomb.style.top = `${parseInt(tomb.style.top) + 5}`;
		setTimeout(player_death_animation.bind(null), 1);
	}
	else if(parseInt(tomb.style.top) < 302) {
		let poke = document.getElementById("PLYR_POKE");
		poke.style.top = `${parseInt(poke.style.top) + 7}`;
		poke.style.height = `${96 - poke.style.top}px`;
		tomb.style.top = `${parseInt(tomb.style.top) + 7}`;
		setTimeout(player_death_animation.bind(null), 1);
	}
	else if(parseInt(tomb.style.top) >= 302) {
		let poke = document.getElementById("PLYR_POKE");
		poke.style="position: absolute; top: 358px; left: 54px; z-index:\
		1; width: 4px; height: auto;"
		setTimeout(reset_tomb.bind(null), 2000);
	}
}

function opponent_death_animation(id){
	let tomb = document.getElementById("tomb");
	tomb.style.left = "415px";
	if(parseInt(tomb.style.top) < -80) {
		tomb.style.top = `${parseInt(tomb.style.top) + 1}`;
		setTimeout(opponent_death_animation.bind(null), 2);
	}	
	else if(parseInt(tomb.style.top) < -50) {
		tomb.style.top = `${parseInt(tomb.style.top) + 2}`;
		setTimeout(opponent_death_animation.bind(null), 2);
	}
	else if(parseInt(tomb.style.top) < 50) {
		let poke = document.getElementById("OPP_POKE");
		poke.style.height = `${96 - (parseInt(tomb.style.top)+50)}px`;
		poke.style.top = `${parseInt(poke.style.top) + 3}`;
		tomb.style.top = `${parseInt(tomb.style.top) + 3}`;
		setTimeout(opponent_death_animation.bind(null), 1);
	}
	else if(parseInt(tomb.style.top) >= 50) {
		document.getElementById("OPP_POKE").style="position: absolute;\
		top: 106px; left: 511px; width: 4px; height: auto;";
		setTimeout(reset_tomb.bind(null), 2000);
	}
}

function reset_tomb(x) {
	document.getElementById("tomb").style.top = -150
}
	

//helper function to simplify code
function hide_class(to_hide){
	let members = document.getElementsByClassName(`${to_hide}`);
	for(let i = 0; i < members.length; i++) {
		members[i].style.display = 'none';
	}
}

//helper function to simplify code
function show_class(to_show){
	let members = document.getElementsByClassName(`${to_show}`);
	for(let i = 0; i < members.length; i++) {
		members[i].style.display = 'inline';
	}
}

//random stuff in here, mostly how I do testing
function attack(num) {
	hide_class("btn");
	if(num == 1){
		setTimeout(swap_opp_poke.bind(null, Math.floor(Math.random() * 152), Math.random()),1);
		setTimeout(swap_plyr_poke.bind(null, Math.floor(Math.random() * 152), Math.random()),1);
	}
	else if (num == 2) {
		player_death_animation();
		setTimeout(swap_plyr_after_death.bind(null, Math.floor(Math.random() * 152), Math.random()),3000);
	}
	else if (num == 3) {
		opponent_death_animation();
		setTimeout(swap_opp_after_death.bind(null, Math.floor(Math.random() * 152), Math.random()),3000);
	}
	else if (num == 4) {
		player_attack_animation_loop();
		setTimeout(opponent_hit_animation_loop.bind(null),500);
		setTimeout(opponent_attack_animation_loop.bind(null),1000);
		setTimeout(player_hit_animation_loop.bind(null),1500);
	}
	console.log("do attack " + num);
	setTimeout(show_class.bind(null, "btn"), 1000);
}


function show_team() {
	console.log("display pokemon");
}

function run(){
	console.log("flee encounter");
}

//does all required graphical changes besides name and level
//for swapping opponent's pokemon
function swap_opp_poke(id_to_swap, percent_remaining) {
	withdraw_opp_animation_loop(0, id_to_swap);
	swap_hp_bar(percent_remaining,0);
}

function swap_opp_after_death(id_to_swap, percent_remaining) {
	withdraw_opp_animation_loop(24, id_to_swap);
	swap_hp_bar(percent_remaining,0);
}

function swap_plyr_poke(id_to_swap, percent_remaining) {
	withdraw_plyr_animation_loop(0, id_to_swap);
	swap_hp_bar(percent_remaining,1);
}

function swap_plyr_after_death(id_to_swap, percent_remaining) {
	withdraw_plyr_animation_loop(24, id_to_swap);
	swap_hp_bar(percent_remaining,1);
}

//anything that needs to be done before battle starts
function startBattle() {

}




















