
const OPP_HBAR_XMIN = 141;
const OPP_HBAR_XMAX = 289;
const PLYR_HBAR_XMIN = 377;
const PLYR_HBAR_XMAX = 526;
const HP_BAR_WIDTH = 148;
var PLYR_POKE;
var OPP_POKE;

//********************** */
tot_hp = []
e_tot_hp = 0


curr_poke_pos = 0
curr_poke = {}
move_list = []
percents = [1,1,1,1,1,1]

enemy_id = 1
enemy_id_list=[]
e_move_list = []
enemy_player_id = []
e_percents = 1


// tot_hp = 100
curr_perc = 1

// e_tot_hp = 100
e_curr_perc = 1

function set_enemy_id(num){
	enemy_id = num
}

function poke_sel(){
    
	document.getElementById("mySidenav").style.width = "550px";
	
}

function closeNav(){
	document.getElementById("mySidenav").style.width = "0";
}

function checkBox(num){
	console.log("selected pokemon: " + num)
	document.getElementById("mySidenav").style.width = "0";
	
	if(num != curr_poke_pos){
		initialize_pokemon(num)
		console.log(curr_poke["hp"])
		enemyAtk(1000)
		console.log(curr_poke["hp"])
	}
	
}

function sel(){
	
	num_move = 1
	console.log("enter")
	console.log(move_list)

	for(ctr = 0; ctr < move_list.length; ctr++){
		// console.log(move_list[ctr]["name"])
		element = "atk" + num_move 
		console.log(ctr)
		// document.getElementById(element) = "<button type='button' id='atk" + num_move  + "' onclick='atk(" + num_move  + ")' class='battle'> Test </button>"
		document.getElementById(element).innerHTML = move_list[ctr]["name"] + ":" + move_list[ctr]["power"]
		
		num_move ++;
	}
	

	document.getElementById("atk1").onclick = function () { atk(0) };
	document.getElementById("atk2").onclick = function () { atk(1) };
	document.getElementById("atk3").onclick = function () { atk(2) };
    document.getElementById("atk4").onclick = function () { atk(3) };
    document.getElementById("atk1").style.visibility = "visible";
    document.getElementById("atk2").style.visibility = "visible";
	document.getElementById("atk3").style.visibility = "visible";
	document.getElementById("atk4").style.visibility = "visible";
}

function atk(num){
	console.log("ATk!!!" + num)
	

	damage = 0

	if (curr_poke["speed"] > enemy_poke["speed"]) {
        
        playerAtk(num)
		
		setTimeout(enemyAtk.bind(null, 200), 1500)
		
	}
	else {
		
		enemyAtk(200)
		
        setTimeout(playerAtk.bind(null, num), 1500)	
		
	}
    console.log("curr_hp: " + curr_poke["hp"])
    setTimeout(checkPoke.bind(null), 1800)
    
    document.getElementById("atk1").style.visibility = "hidden";
    document.getElementById("atk2").style.visibility = "hidden";
    document.getElementById("atk3").style.visibility = "hidden";
    document.getElementById("atk4").style.visibility = "hidden";
    
	setTimeout(summonButtons.bind(null), 2500)
}

function summonButtons(){
    document.getElementById("atk1").style.visibility = "visible";
    document.getElementById("atk2").style.visibility = "visible";

    document.getElementById("atk1").innerHTML = "Select Move"
	document.getElementById("atk1").onclick = function () { sel() };

	document.getElementById("atk2").innerHTML = "Select Pokemon"
	document.getElementById("atk2").onclick = function () { poke_sel() };

	document.getElementById("atk3").style.visibility = "hidden";
	document.getElementById("atk4").style.visibility = "hidden";
}

function gameOver(num){
    console.log("Game is over: " + num);
    
    if(num == 1){
        setTimeout(push_poke.bind(null),1000)
    }
    else{
        location.replace("http://localhost/project3/game_over.html") 
    }
}

function checkPoke(){
    console.log("checkPoke")

    if(curr_poke["hp"] <= 0){
		for(ctr = 0; ctr < my_poke.length; ctr++){
            console.log(my_poke[ctr])
            if(my_poke[ctr]["hp"] > 0){
                document.getElementById("x_btn").style.visibility = "hidden"
                document.getElementById("checkbox" + curr_poke_pos).style.visibility = "hidden"
                
                setTimeout(poke_sel.bind(null,ctr),1000)
                console.log(curr_poke["hp"])
                return
            }
        }

        gameOver(0)
	}
	if(enemy_poke["hp"] <= 0){
		gameOver(1)
	}

    return
  
}

function playerAtk(num){
    curr_move = move_list[num];
    // console.log(move_list)
    setTimeout(player_attack_animation_loop.bind(null), 200);
    // damage = calc_damage(curr_move["power"])

    damage = damageCalc(curr_move,curr_poke,enemy_poke)

    // console.log("my damage: " + damage)
    // console.log("enemy hp: " + enemy_poke["hp"])

    enemy_poke["hp"] = enemy_poke["hp"] - damage
    curr_perc = (damage/e_tot_hp)

    e_percents = e_percents - (damage/e_tot_hp)

    

    if (enemy_poke["hp"] <= 0) {
        gameOver(1)
    }
    else{
        setTimeout( opponent_hit_animation_loop.bind(null), 800)
        setTimeout( show_damage.bind(null, curr_perc, 0), 1000)
    }
}

function enemyAtk(e_time){

    setTimeout(opponent_attack_animation_loop.bind(null), e_time)

	num = Math.floor(Math.random() * 4); 
	enemy_move = e_move_list[num]
    // inv_damage = calc_damage(enemy_move["power"])
    inv_damage = damageCalc(enemy_move,enemy_poke, curr_poke)

    // console.log("enemy damage: " + inv_damage)
    // console.log("current hp: " + curr_poke["hp"])
    // console.log("total hp: " + tot_hp )
    // console.log("what will be dealt: " + (inv_damage/tot_hp)  )

	curr_poke["hp"] = curr_poke["hp"]  - inv_damage
    e_curr_perc = (inv_damage/tot_hp[curr_poke_pos])

    percents[curr_poke_pos] = percents[curr_poke_pos] - (inv_damage/tot_hp)
    // console.log("current state of percent after damage: " + percents[curr_poke_pos])

    
    

    if (curr_poke["hp"] <= 0) {
        checkPoke()
    }
    else{
        setTimeout( player_hit_animation_loop.bind(null), e_time + 600)
        setTimeout( show_damage.bind(null, e_curr_perc, 1), e_time + 800)
    }
}


//**************************************************** */



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
    // console.log("check???")
	if(percent>=0) {
		mod = 1;
		max_loops = parseInt(percent * HP_BAR_WIDTH);
	}
	else{
		mod = -1;
        max_loops = parseInt(-1 * percent * HP_BAR_WIDTH);
        // console.log("max loops: " + max_loops)
	}
	var bar;
	if(player == false) {
		bar = document.getElementById("OPP_HBAR_Cover");
		setTimeout(adjust_opp_hp_bar.bind(null, 0, max_loops, mod, bar),3);
	} else {
        bar = document.getElementById("PLYR_HBAR_Cover");
        // console.log("max loops: " + max_loops)
		setTimeout(adjust_plyr_hp_bar.bind(null, 0, max_loops, mod, bar),3);
	}

}

function swap_hp_bar(percent, player) {
    // console.log("check!!! " + percent)
    if(player == false) {
        bar = document.getElementById("OPP_HBAR_Cover");
        bar.style.left = OPP_HBAR_XMIN;
        bar.style.width = HP_BAR_WIDTH;
    } else {
        bar = document.getElementById("PLYR_HBAR_Cover");
        bar.style.left = PLYR_HBAR_XMIN;
        bar.style.width = HP_BAR_WIDTH;
    }
    setTimeout(show_damage.bind(null, -percent, player), 3);
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

// function attack(num) {
// 	//hide_class("btn");
// 	//player_attack_animation_loop();
// 	//opponent_hit_animation_loop();
// 	console.log("do attack " + num);
// }

// function show_team() {
// 	console.log("display pokemon");
// }

function startBattle() {
	// show_damage(.50, 1);
	// show_damage(.33,0);
	//PLYR_POKE = new Pokemon(/*insert parameter here*/);
    //PLYR_POKE = new Pokemon(/*insert parameter here*/);
    
    player_id = []
	poke_id = []
	my_poke = []
	enemy_poke = {}

    move_id = []
    
    xp = []
    hp = []
	// move = {}

	collectTeam("php/player_poke.php")
}


//**************************************************** */

function createPokeSelect(img, name, type1, type2, total, hp, attack, defence, spA, spD, speed, xp, ctr) {
    // console.log("check5")
    if (hp <= 0) {
        toAdd = '<div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Type 1 <br /> </p>                <p class="name">' + type1 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Typ 2 <br /> </p>                <p class="name">' + type2 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Total <br /> </p>                <p class="name">' + total + '  <br /> </p>            </div>            <div class="desc">                <p class="title">HP <br /> </p>                <p class="name">' + hp + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Attack <br /> </p>                <p class="name">' + attack + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Defence <br /> </p>                <p class="name">' + defence + '  <br /> </p>            </div>  <div class="desc">                <p class="title">XP <br /> </p>                <p class="name">' + xp + '  <br /> </p>               </div>'
    }
    else {
        toAdd = '<div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Type 1 <br /> </p>                <p class="name">' + type1 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Typ 2 <br /> </p>                <p class="name">' + type2 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Total <br /> </p>                <p class="name">' + total + '  <br /> </p>            </div>            <div class="desc">                <p class="title">HP <br /> </p>                <p class="name">' + hp + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Attack <br /> </p>                <p class="name">' + attack + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Defence <br /> </p>                <p class="name">' + defence + '  <br /> </p>            </div>  <div class="desc">                <p class="title">XP <br /> </p>                <p class="name">' + xp + '  <br /> </p>            </div>   <div class="desc">                <Button onclick="checkBox(' + ctr + ')" class="check_box" id="checkbox' + ctr + '" >            </div>       </div>'
    }
    document.getElementById("mySidenav").innerHTML += toAdd
}

function createPoke(list) {
	console.log("createPoke")

	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(",")
		// console.log(word[1])
		player_id.push(word[0])
        poke_id.push(word[1])
        hp.push(word[2])
		xp.push(word[3])
	}

	collectTeam("php/enemy.php")
}

e_xp = []
function createEnemy(list){
	console.log("createEnemy")

	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(",")
		// console.log(word[1])
		enemy_player_id.push(word[0])
        enemy_id_list.push(word[1])
        e_xp.push(word[2])
	}

	enemy_id = enemy_id_list[0]
	collectTeam("php/poke.php")
}

function toAddPoke(list) {
	console.log("toAdd")
	var myCtr = 0
	
	for (var ctr = 0; ctr < list.length - 1; ctr++) {
		word = list[ctr]
		word = word.split(" ")
		// console.log(word)
        
        pos = poke_id.indexOf(word[0])
		if (pos >= 0) {
			createPokeSelect("poke_front/poke_" + (ctr + 1) + ".png", word[1], word[2], word[3], word[4], hp[pos], word[6], word[7], word[8], word[9], word[10], xp[pos], myCtr)
			toAdd = {}
			toAdd["poke_id"] = word[0]
			toAdd["name"] = word[1]
			toAdd["type1"] = word[2]
			toAdd["type2"] = word[3]
			toAdd["total"] = word[4]
            toAdd["hp"] = hp[pos]
            tot_hp[myCtr] = word[5]
			toAdd["attack"] = word[6]
			toAdd["defense"] = word[7]
			toAdd["sp.atk"] = word[8]
			toAdd["sp.def"] = word[9]
            toAdd["speed"] = word[10]
            toAdd["xp"] = xp[pos]
			my_poke.push(toAdd)
            // console.log(toAdd["hp"] )
            
            // tot_hp[myCtr] = toAdd["hp"]
			myCtr++
		}

		if(enemy_id == word[0]){
			toAdd = {}
			toAdd["poke_id"] = word[0]
			toAdd["name"] = word[1]
			toAdd["type1"] = word[2]
			toAdd["type2"] = word[3]
			toAdd["total"] = word[4]
            toAdd["hp"] = word[5]

            //change if there are multiple pokemons
            toAdd["xp"] = e_xp[0]
			toAdd["attack"] = word[6]
			toAdd["defense"] = word[7]
			toAdd["sp.atk"] = word[8]
			toAdd["sp.def"] = word[9]
			toAdd["speed"] = word[10]
            enemy_poke = toAdd

           
		}
		
	}

	poke_id = []
	

	collectTeam("php/poke_moves.php")
}

function collectTeam(url) {
	list = ""

	var theRequest = new XMLHttpRequest();

	theRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// document.getElementById("change").innerHTML += "Complete";
			
			list = this.responseText;
			list = list.split("\n")
			if (url == "php/player_poke.php") {
				createPoke(list)
			}
			else if(url == "php/poke.php"){
				toAddPoke(list)
			}
			else if(url == "php/poke_moves.php"){
				createInit(list)
			}
			else if(url == "php/moves_m.php"){
				finalInit(list)
			}
			else if(url == "php/enemy.php"){
				createEnemy(list)
			}


		}

	};
	theRequest.open("GET", url, true);
	theRequest.send();
}






//**************************************************** */


function createInit(list) {
    console.log("createInit")
    // console.log(list)
    for (var ctr = 0; ctr < list.length - 1; ctr++) {
        word = list[ctr]
        word = word.split(",")
        // console.log(word)
        poke_id.push(word[0])
        move_id.push(word[1])
    }
	collectTeam("php/moves_m.php")
}

function finalInit(list){
    console.log("finalInit")
    
    // console.log(move_id)
    for (var ctr = 0; ctr < list.length - 1; ctr++) {
        word = list[ctr]
        word = word.split(",")
        
        if(move_id.includes(word[0])){
            
            toAdd = {}
            toAdd["move_id"] = word[0]
            toAdd["name"] = word[1]
            toAdd["type"] = word[2]
            toAdd["category"] = word[3]
            toAdd["pp"] = word[4]
			toAdd["power"] = parseInt(word[5])
			toAdd["accuracy"] = word[6]
            
            
            if(isNaN(toAdd["power"]))
                toAdd["power"] = 0

            // console.log("Power!!! " + parseInt(toAdd["power"]))
            move[word[0]] = toAdd
        }
	}

	curr_poke_pos = 0

    for(ctr = 0; ctr < my_poke.length; ctr++){
        console.log(my_poke[ctr])
        if(my_poke[ctr]["hp"] > 0){
            initialize_pokemon(ctr)
            break;
        }
    }
	// initialize_pokemon(curr_poke_pos)
	initialize_e_pokemon(enemy_id)
}

function getMoves(p_id){
    toReturn = []
    // console.log("getMoves: " + p_id)
	// console.log(move[380])
	check = 0
    for(var ctr = 0; ctr < poke_id.length - 1; ctr++){
        if(poke_id[ctr] == p_id && check < 4){
			num = parseInt(move_id[ctr])
			// console.log("Move!!!" + check)
			// console.log(move[num])
            
			toReturn.push(move[num])
			check++
        }
    }
	
    return toReturn
}

function initialize_pokemon(num){
	console.log("initialize_pokemon")
	
	curr_poke_pos = num

	// console.log(curr_poke_pos)
	// console.log(my_poke)
	// tot_hp = my_poke[curr_poke_pos]["hp"]

	curr_poke = my_poke[curr_poke_pos]

	move_list = getMoves(curr_poke["poke_id"])

	// one = "poke_back/poke_" + curr_poke["poke_id"] + ".png"
    // document.getElementById("PLYR_POKE").src = one

    withdraw_plyr_animation_loop(0, curr_poke["poke_id"])


    document.getElementById("plyr_name").innerHTML = curr_poke["name"]
    document.getElementById("plyr_lvl").innerHTML = curr_poke["xp"]
    
    let mod;
    var bar = document.getElementById("PLYR_HBAR_Cover");
    percents[curr_poke_pos] = curr_poke["hp"]/tot_hp[curr_poke_pos]
    
    temp_perc = percents[curr_poke_pos];
    // console.log("curr_loop! " + temp_perc )

    document.getElementById("x_btn").style.visibility = "visible"

    setTimeout(swap_hp_bar.bind(null, temp_perc, 1),3);
	
}

function initialize_e_pokemon(num){
	console.log("initialize_e_pokemon")
	two = "poke_front/poke_" + num + ".png"
    
	document.getElementById("OPP_POKE").src = two
	enemy_id = num

	e_tot_hp = enemy_poke["hp"]

    e_move_list = getMoves(enemy_id)
    document.getElementById("opp_name").innerHTML = enemy_poke["name"]
    document.getElementById("opp_lvl").innerHTML = enemy_poke["xp"]
}


function push_poke() {
    
    player_id = []
    poke_id = []
    hp = []
    xp = []

    for (var ctr = 0; ctr < my_poke.length; ctr++) {

        player_id.push("1")
        poke_id.push(my_poke[ctr]["poke_id"])
        
        hp.push(my_poke[ctr]["hp"])
        xp.push(parseInt(my_poke[ctr]["xp"]) + 1)
    }

    console.log(poke_id)

    $.ajax({
        type: "POST",  //type of method
        url: "php/send_player_poke.php",  //your page
        data: { player_id: player_id, poke_id: poke_id, xp: xp, hp: hp },// passing the values
        success: function (res) {
          console.log("success")             //do what you want here...
        //   $("#change").html(res);  
        }
      });

      location.replace("http://localhost/project3/proj3_m.html") 
}



//********************************************************************* */


function damageCalc(selectedAttack, attacker, defender){
    myRand = getRandomInt(217,255);
    myTypeBonus = typeBonus(selectedAttack,attacker);//if type of attack the same
    typeMod = damageMultiplier(selectedAttack, defender);//if type of attack effective/not against defender
    attackerLevel = 100
    // console.log("check attacker: " +  defender["sp.def"] )

    if(selectedAttack["type"] == "Fire" || selectedAttack["type"] == "Water" || selectedAttack["type"] == "Grass" || selectedAttack["type"] == "Ice" || selectedAttack["type"] == "Electric" || selectedAttack["type"] == "Psychic"){ //if the attack is elemental, use the Special Attack stat
        // defender["hp"] = defender["hp"] - (((((((((2*attacker["level"]/5+2)*attacker["sp.atk"]*selectedAttack["power"])/defender["sp.def"])/50)+2)*mytypeBonus)*typeMod/10)*myRand)/255);
        // console.log("get le damage: " + (((((((((2*attackerLevel/5+2)*attacker["sp.atk"]*selectedAttack["power"])/defender["sp.def"])/50)+2)*myTypeBonus)*typeMod/10)*myRand)/255))
        return (((((( (((2*attackerLevel/5+2)*attacker["sp.atk"]*selectedAttack["power"])/defender["sp.def"])/50)+2)*myTypeBonus)*typeMod/10)*myRand)/255);
    }
    else{// if the attack is not elemental, use Normal attack stat
        // defender["hp"] = defender["hp"] - (((((((((2*attacker["level"]/5+2)*attacker["attack"]*selectedAttack["power"])/defender["defense"])/50)+2)*mytypeBonus)*typeMod/10)*myRand)/255);    
        // console.log("get la damage: " + (((((((((2*attackerLevel/5+2)*attacker["attack"]*selectedAttack["power"])/defender["defense"])/50)+2)*myTypeBonus)*typeMod/10)*myRand)/255))
        return ((((((( ((2*attackerLevel/5+2)*attacker["attack"]*selectedAttack["power"])/defender["defense"])/50)+2)*myTypeBonus)*typeMod/10)*myRand)/255);     
    }

    return -1;
}

function typeBonus(selectedAttack, attacker){//if the attacker is using a move type the same as the attacker type, make the attack stronger
    if(selectedAttack["type"] == attacker["type1"] || selectedAttack["type"] == attacker["type2"]){
        return 1.5;
    }
    else{
        return 1;
    }
}

function damageMultiplier(selectedAttack, defender) {
    //weakness table take it in
    var dict = {
        storage: {},
        get: function (a, b){
            
            return this.storage[a][b];
        },
        put: function (a, b, value){
            if (typeof this.storage[a] !== "object")
                this.storage[a] = {};
            this.storage[a][b] = value;
        }
    }
    dict.put("Normal","Normal",1);
    dict.put("Normal","Fighting",1);
    dict.put("Normal","Flying",1);
    dict.put("Normal","Poison",1);
    dict.put("Normal","Ground",1);
    dict.put("Normal","Rock",0.5);
    dict.put("Normal","Bug",1);
    dict.put("Normal","Ghost",0);
    dict.put("Normal","Fire",1);
    dict.put("Normal","Water",1);
    dict.put("Normal","Grass",1);
    dict.put("Normal","Electric",1);
    dict.put("Normal","Psychic",1);
    dict.put("Normal","Ice",1);
    dict.put("Normal","Dragon",1);
    dict.put("Fighting","Normal",2);
    dict.put("Fighting","Fighting",1);
    dict.put("Fighting","Flying",0.5);
    dict.put("Fighting","Poison",0.5);
    dict.put("Fighting","Ground",1);
    dict.put("Fighting","Rock",2);
    dict.put("Fighting","Bug",0.5);
    dict.put("Fighting","Ghost",0);
    dict.put("Fighting","Fire",1);
    dict.put("Fighting","Water",1);
    dict.put("Fighting","Grass",1);
    dict.put("Fighting","Electric",1);
    dict.put("Fighting","Psychic",0.5);
    dict.put("Fighting","Ice",2);
    dict.put("Fighting","Dragon",1);
    dict.put("Flying","Normal",1);
    dict.put("Flying","Fighting",2);
    dict.put("Flying","Flying",1);
    dict.put("Flying","Poison",1);
    dict.put("Flying","Ground",1);
    dict.put("Flying","Rock",0.5);
    dict.put("Flying","Bug",2);
    dict.put("Flying","Ghost",1);
    dict.put("Flying","Fire",1);
    dict.put("Flying","Water",1);
    dict.put("Flying","Grass",2);
    dict.put("Flying","Electric",0.5);
    dict.put("Flying","Psychic",1);
    dict.put("Flying","Ice",1);
    dict.put("Flying","Dragon",1);
    dict.put("Poison","Normal",1);
    dict.put("Poison","Fighting",1);
    dict.put("Poison","Flying",1);
    dict.put("Poison","Poison",0.5);
    dict.put("Poison","Ground",0.5);
    dict.put("Poison","Rock",0.5);
    dict.put("Poison","Bug",1);
    dict.put("Poison","Ghost",0.5);
    dict.put("Poison","Fire",1);
    dict.put("Poison","Water",1);
    dict.put("Poison","Grass",2);
    dict.put("Poison","Electric",1);
    dict.put("Poison","Psychic",1);
    dict.put("Poison","Ice",1);
    dict.put("Poison","Dragon",1);
    dict.put("Ground","Normal",1);
    dict.put("Ground","Fighting",1);
    dict.put("Ground","Flying",0);
    dict.put("Ground","Poison",2);
    dict.put("Ground","Ground",1);
    dict.put("Ground","Rock",2);
    dict.put("Ground","Bug",0.5);
    dict.put("Ground","Ghost",1);
    dict.put("Ground","Fire",2);
    dict.put("Ground","Water",1);
    dict.put("Ground","Grass",0.5);
    dict.put("Ground","Electric",2);
    dict.put("Ground","Psychic",1);
    dict.put("Ground","Ice",1);
    dict.put("Ground","Dragon",1);
    dict.put("Rock","Normal",1);
    dict.put("Rock","Fighting",0.5);
    dict.put("Rock","Flying",2);
    dict.put("Rock","Poison",1);
    dict.put("Rock","Ground",0.5);
    dict.put("Rock","Rock",1);
    dict.put("Rock","Bug",2);
    dict.put("Rock","Ghost",1);
    dict.put("Rock","Fire",2);
    dict.put("Rock","Water",1);
    dict.put("Rock","Grass",1);
    dict.put("Rock","Electric",1);
    dict.put("Rock","Psychic",1);
    dict.put("Rock","Ice",2);
    dict.put("Rock","Dragon",1);
    dict.put("Bug","Normal",1);
    dict.put("Bug","Fighting",0.5);
    dict.put("Bug","Flying",0.5);
    dict.put("Bug","Poison",0.5);
    dict.put("Bug","Ground",1);
    dict.put("Bug","Rock",1);
    dict.put("Bug","Bug",1);
    dict.put("Bug","Ghost",0.5);
    dict.put("Bug","Fire",0.5);
    dict.put("Bug","Water",1);
    dict.put("Bug","Grass",2);
    dict.put("Bug","Electric",1);
    dict.put("Bug","Psychic",2);
    dict.put("Bug","Ice",1);
    dict.put("Bug","Dragon",1);
    dict.put("Ghost","Normal",0);
    dict.put("Ghost","Fighting",0);
    dict.put("Ghost","Flying",1);
    dict.put("Ghost","Poison",1);
    dict.put("Ghost","Ground",1);
    dict.put("Ghost","Rock",1);
    dict.put("Ghost","Bug",1);
    dict.put("Ghost","Ghost",2);
    dict.put("Ghost","Fire",1);
    dict.put("Ghost","Water",1);
    dict.put("Ghost","Grass",1);
    dict.put("Ghost","Electric",1);
    dict.put("Ghost","Psychic",2);
    dict.put("Ghost","Ice",1);
    dict.put("Ghost","Dragon",1);
    dict.put("Fire","Normal",1);
    dict.put("Fire","Fighting",1);
    dict.put("Fire","Flying",1);
    dict.put("Fire","Poison",1);
    dict.put("Fire","Ground",1);
    dict.put("Fire","Rock",0.5);
    dict.put("Fire","Bug",2);
    dict.put("Fire","Ghost",1);
    dict.put("Fire","Fire",0.5);
    dict.put("Fire","Water",0.6);
    dict.put("Fire","Grass",2);
    dict.put("Fire","Electric",1);
    dict.put("Fire","Psychic",1);
    dict.put("Fire","Ice",2);
    dict.put("Fire","Dragon",0.5);
    dict.put("Water","Normal",1);
    dict.put("Water","Fighting",1);
    dict.put("Water","Flying",1);
    dict.put("Water","Poison",1);
    dict.put("Water","Ground",2);
    dict.put("Water","Rock",2);
    dict.put("Water","Bug",1);
    dict.put("Water","Ghost",1);
    dict.put("Water","Fire",2);
    dict.put("Water","Water",0.5);
    dict.put("Water","Grass",0.5);
    dict.put("Water","Electric",1);
    dict.put("Water","Psychic",1);
    dict.put("Water","Ice",1);
    dict.put("Water","Dragon",0.5);
    dict.put("Grass","Normal",1);
    dict.put("Grass","Fighting",1);
    dict.put("Grass","Flying",0.5);
    dict.put("Grass","Poison",0.5);
    dict.put("Grass","Ground",2);
    dict.put("Grass","Rock",0.5);
    dict.put("Grass","Bug",0.5);
    dict.put("Grass","Ghost",1);
    dict.put("Grass","Fire",0.5);
    dict.put("Grass","Water",2);
    dict.put("Grass","Grass",0.5);
    dict.put("Grass","Electric",1);
    dict.put("Grass","Psychic",1);
    dict.put("Grass","Ice",1);
    dict.put("Grass","Dragon",0.5);
    dict.put("Electric","Normal",1);
    dict.put("Electric","Fighting",1);
    dict.put("Electric","Flying",2);
    dict.put("Electric","Poison",1);
    dict.put("Electric","Ground",0);
    dict.put("Electric","Rock",1);
    dict.put("Electric","Bug",1);
    dict.put("Electric","Ghost",1);
    dict.put("Electric","Fire",1);
    dict.put("Electric","Water",2);
    dict.put("Electric","Grass",0.5);
    dict.put("Electric","Electric",0.5);
    dict.put("Electric","Psychic",1);
    dict.put("Electric","Ice",1);
    dict.put("Electric","Dragon",0.5);
    dict.put("Psychic","Normal",1);
    dict.put("Psychic","Fighting",2);
    dict.put("Psychic","Flying",1);
    dict.put("Psychic","Poison",2);
    dict.put("Psychic","Ground",1);
    dict.put("Psychic","Rock",1);
    dict.put("Psychic","Bug",1);
    dict.put("Psychic","Ghost",1);
    dict.put("Psychic","Fire",1);
    dict.put("Psychic","Water",1);
    dict.put("Psychic","Grass",1);
    dict.put("Psychic","Electric",1);
    dict.put("Psychic","Psychic",0.5);
    dict.put("Psychic","Ice",1);
    dict.put("Psychic","Dragon",1);
    dict.put("Ice","Normal",1);
    dict.put("Ice","Fighting",1);
    dict.put("Ice","Flying",2);
    dict.put("Ice","Poison",1);
    dict.put("Ice","Ground",2);
    dict.put("Ice","Rock",1);
    dict.put("Ice","Bug",1);
    dict.put("Ice","Ghost",1);
    dict.put("Ice","Fire",0.5);
    dict.put("Ice","Water",0.5);
    dict.put("Ice","Grass",2);
    dict.put("Ice","Electric",1);
    dict.put("Ice","Psychic",1);
    dict.put("Ice","Ice",0.5);
    dict.put("Ice","Dragon",2);
    dict.put("Dragon","Normal",1);
    dict.put("Dragon","Fighting",1);
    dict.put("Dragon","Flying",1);
    dict.put("Dragon","Poison",1);
    dict.put("Dragon","Ground",1);
    dict.put("Dragon","Rock",1);
    dict.put("Dragon","Bug",1);
    dict.put("Dragon","Ghost",1);
    dict.put("Dragon","Fire",1);
    dict.put("Dragon","Water",1);
    dict.put("Dragon","Grass",1);
    dict.put("Dragon","Electric",1);
    dict.put("Dragon","Psychic",1);
    dict.put("Dragon","Ice",1);
    dict.put("Dragon","Dragon",2);
    if(defender["type2"]==""){
        // console.log("jame's return " + dict.get([selectedAttack["type"]],[defender["type1"]]));
        return dict.get([selectedAttack["type"]],[defender["type1"]]);
    }
    else{
        val1 = dict.get([selectedAttack["type"]],[defender["type1"]]);
        val2 = dict.get([selectedAttack["type"]],[defender["type2"]]);
        val3 = val1*val2;
        // console.log(val3);
        return(val1*val2);
    }
}

function getRandomInt(min, max) {//default random number generator
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }