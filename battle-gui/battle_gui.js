
const OPP_HBAR_XMIN = 141;
const OPP_HBAR_XMAX = 289;
const PLYR_HBAR_XMIN = 377;
const PLYR_HBAR_XMAX = 526;
const HP_BAR_WIDTH = 148;
var PLYR_POKE;
var OPP_POKE;
var anim_flag = 4;


function adjust_opp_hp_bar(loops, max_loops, mod, bar) {
	let x = parseInt(bar.style.left);
	let w = parseInt(bar.style.width);
	x -= mod;
	w += mod;
	
	if(loops < max_loops && x >= OPP_HBAR_XMIN && x<= OPP_HBAR_XMAX) {
		bar.style.left = `${x}`;
		bar.style.width = `${w}`;
		setTimeout(adjust_opp_hp_bar.bind(null,loops+1,max_loops, mod, bar),3);
	}
}

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
function show_damage(percent, player) {
	let mod;
	if(percent>=0) {
		mod = 1;
		max_loops = parseInt(percent * HP_BAR_WIDTH);
	}
	else{
		mod = -1;
		max_loops = parseInt(-1 * percent * HP_BAR_WIDTH);
	}
	var bar;
	if(player == false) {
		bar = document.getElementById("OPP_HBAR_Cover");
		setTimeout(adjust_opp_hp_bar.bind(null, 0, max_loops, mod, bar),3);
	} else {
		bar = document.getElementById("PLYR_HBAR_Cover");
		setTimeout(adjust_plyr_hp_bar.bind(null, 0, max_loops, mod, bar),3);
	}

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

function player_attack_animation_loop() {
	let poke = document.getElementById("PLYR_POKE");
	move(poke, 1, 10, 2, 3, "x");
	setTimeout(move.bind(null, poke, 1, 50, 1, 1, "x"),31);
	setTimeout(move.bind(null, poke, 1, 50, -1, 1, "x"),82);
	setTimeout(move.bind(null, poke, 1, 10, -2, 3, "x"),133);
}

function player_hit_animation_loop() {
	let poke = document.getElementById("PLYR_POKE");
	move_diagonal(poke, 1, 25, 2, 1, 3);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 1), 100);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 3), 200);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 2, 1, 1), 300);
}


function opponent_attack_animation_loop() {
	let poke = document.getElementById("OPP_POKE");
	move(poke, 1, 10, -2, 3, "x");
	setTimeout(move.bind(null, poke, 1, 50, -1, 1, "x"),31);
	setTimeout(move.bind(null, poke, 1, 50, 1, 1, "x"),82);
	setTimeout(move.bind(null, poke, 1, 10, 2, 3, "x"),133);
}


function opponent_hit_animation_loop() {
	let poke = document.getElementById("OPP_POKE");
	move_diagonal(poke, 1, 25, 2, 1, 1);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 3), 100);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 1, 1, 1), 200);
	setTimeout(move_diagonal.bind(null, poke, 1, 25, 2, 1, 3), 300);
}

function hide_class(to_hide){
	let members = document.getElementsByClassName(`${to_hide}`);
	for(let i = 0; i < members.length; i++) {
		members[i].style.display = 'none';
	}
}

function show_class(to_show){
	let members = document.getElementsByClassName(`${to_show}`);
	for(let i = 0; i < members.length; i++) {
		members[i].style.display = 'inline';
	}
}

function attack(num) {
	hide_class("btn");
	player_attack_animation_loop();
	setTimeout(opponent_hit_animation_loop,500);
	setTimeout(opponent_attack_animation_loop,1000);
	setTimeout(player_hit_animation_loop,1500);
	console.log("do attack " + num);
	setTimeout(show_class.bind(null, "btn"), 2000);
}

function show_team() {
	console.log("display pokemon");
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

function startBattle() {
	show_damage(.50, 1);
	show_damage(.33,0);
	setTimeout(swap_hp_bar.bind(null, 1, 1),2000);
	//PLYR_POKE = new Pokemon(/*insert parameter here*/);
	//PLYR_POKE = new Pokemon(/*insert parameter here*/);
}