
const OPP_HBAR_Y = 140;
const OPP_HBAR_XMIN = 141;
const OPP_HBAR_XMAX = 289;
const HP_BAR_WIDTH = 148;
var PLYR_POKE;
var OPP_POKE;
//Must be called before damage is actually done

//maybe for storing info? IDK if needed
function Pokemon(/*insert parameter here*/) {
    /*this.name = 
    this.hp_max = 
    this.hp_curr =
	this.attack =
	this.defense =
	this.sp_attack = 
	this.sp_defense =
	this.speed = 
	this.type1 =
	this.type2 =
	this.attack1 = 
	this.attack2 =
	this.attack3 =
	this.attack4 = */
}

function adjust_opp_hp_bar(loops, max_loops, mod) {
	bar = document.getElementById("OPP_HBAR_Cover");
	let x = parseInt(bar.style.left);
	let w = parseInt(bar.style.width);
	x -= mod;
	w += mod;
	
	if(loops < max_loops && x >= OPP_HBAR_XMIN && x<= OPP_HBAR_XMAX) {
		bar.style.left = `${x}`;
		bar.style.width = `${w}`;
		setTimeout(adjust_opp_hp_bar.bind(null,loops+1,max_loops, mod),3);
	}
}
	
//takes in percent of damage done as a float (55% damage = .55)
function show_damage(percent) {
	let mod = 0;
	if(percent>=0) {
		mod = 1;
		max_loops = parseInt(percent * HP_BAR_WIDTH);
	}
	else{
		mod = -1;
		max_loops = parseInt(-1 * percent * HP_BAR_WIDTH);
	}
	setTimeout(adjust_opp_hp_bar.bind(null, 0, max_loops, mod),3);
}

function attack(num) {
	console.log("do attack " + num);
}

function startBattle() {
	show_damage(.50);
	//PLYR_POKE = new Pokemon(/*insert parameter here*/);
	//PLYR_POKE = new Pokemon(/*insert parameter here*/);
}