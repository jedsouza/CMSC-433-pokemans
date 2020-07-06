<?php
class Pokemon {
	private $m_num;
	private $m_name;
	private $m_level;
	private $m_t1;
	private $m_t2;
	private $m_hp;
	private $m_attack;
	private $m_defense;	
	private $m_spAttack;
	private $m_spDefense;
	private $m_speed;
	private $m_moves = array();
	
	
	function Pokemon($num, $name, $cat, $t1, $t2, $hp, $attack, $defense, $spAttack, $spDefense, $speed) {
		$this->m_num = $num;
		$this->m_name = $name;
		$this->m_level = $cat;
		$this->m_t1 = $t1;
		$this->m_t2 = $t2;
		$this->m_hp = $hp;
		$this->m_attack = $attack;
		$this->m_defense = $defense;
		$this->m_spAttack = $spAttack;
		$this->m_spDefense = $spDefense;
		$this->m_speed = $speed;		
	}
	
		
	function setMoves(){
		for($i=0; $i<=3; $i+=1){
			echo $i . "<br>";
			$this->m_moves[$i]->setName("m" . $i);
			$this->m_moves[$i]->setNum($i);
		}
	}
	
	function moveDump(){
		for($i=0; $i<=3; $i+=1){
			$this->m_moves[$i]->dump();			
		}
	}
	
	function doAttack($pok){
		$dmg = $this->m_attack - $pok->m_defense;
		if($dmg > 0){
			$pok->m_hp -= $dmg;
		}
		else{
			$pok->m_hp -= 1;
		}		
	}
	
	function levelUp(){
		$this->m_level += 1;
		$this->m_hp += 10;
		$this->m_attack += 2;
		$this->m_defense += 2;
		$this->m_spAttack += 2;
		$this->m_spDefense += 2;
		$this->m_speed += 2;
	}
	
	function dump(){ 
		echo "Num: " . $this->m_num . " Name: " . $this->m_name . "<br>";
		echo "Level: " . $this->m_level . "<br>";
		echo "Type 1: " . $this->m_t1 . " Type 2: " . $this->m_t2 . "<br>";
		echo "HP: " . $this->m_hp . " Speed: " . $this->m_speed . "<br>";
		echo "Attack: " . $this->m_attack . " Defense: " . $this->m_defense . "<br>";
		echo "Special attack: " . $this->m_spAttack . " Special Defense: " . $this->m_spDefense . "<br>";
		echo "<br>";
	}
}

class Move {
	private $m_num;
	private $m_name;
	/*private $m_cat;
	private $m_type;
	private $m_contest;
	private $m_pp;		
	private $m_power;
	private $m_accuracy;*/
	
	
	function Move($num, $name /*$cat, $type, $contest, $pp, $power, $accuracy*/) {
		$this->m_num = $num;
		$this->m_name = $name;
		/*$this->m_cat = $cat;
		$this->m_type = $type;
		$this->m_contest = $contest;
		$this->m_pp = $pp;
		$this->m_power = $power;
		$this->m_accuracy = $accuracy;*/
	}
	
	function setName($name){
		$this->m_name = $name;
	}
	
	function setNum($num){
		$this->m_num = $num;
	}
			
	function dump(){ 
		echo "Num: " . $this->m_num . " Name: " . $this->m_name . "<br>";
		/*echo "cat: " . $this->m_cat . "<br>";
		echo "Type: " . $this->m_type . " Contest: " . $this->m_contest . "<br>";
		echo "pp: " . $this->m_pp . " accuracy: " . $this->m_accuracy . "<br>";
		
		echo "Special attack: " . $this->m_power . " Special Defense: " . $this->m_spDefense . "<br>";
		echo "<br>";*/
	}
}

class Trainer{
	private $m_pokemons = array(4);
	
	function Trainer{
	}
	
	function battle(){
		
	}
}

// create an object
$p1=new Pokemon(1,"A",4,"F","W",400,28,20,12,18,19);
$p2=new Pokemon(2,"B",3,"E","D",300,18,19,19,12,17);
//$aMove=new Move(1,"M");
$p1->setMoves();
// show object properties
$p1->dump();
$p2->dump();
$p1->doAttack($p2);
$p2->doAttack($p1);
$p1->levelUp();
$p1->dump();
$p2->dump();
//$aMove->dump();

$p1->moveDump();
?>
