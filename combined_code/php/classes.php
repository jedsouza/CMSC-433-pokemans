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
    private $m_front_img;
    private $m_back_img;
	
	
	function Pokemon($num, $name, $lvl, $t1, $t2, $hp, $attack, $defense, $spAttack, $spDefense, $speed, $front_img, $back_img) {
		$this->m_num = $num;
		$this->m_name = $name;
		$this->m_level = $lvl;
		$this->m_t1 = $t1;
		$this->m_t2 = $t2;
		$this->m_hp = $hp;
		$this->m_attack = $attack;
		$this->m_defense = $defense;
		$this->m_spAttack = $spAttack;
		$this->m_spDefense = $spDefense;
        $this->m_speed = $speed;
        $this->m_front_img = $front_img;
        $this->m_back_img = $back_img;
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
class moves {

}

class player {
	
}
?>