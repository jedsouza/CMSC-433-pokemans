<?php
    require_once "conn.php";

    $conn = OpenCon();

    $player = $_POST["player_id"];
    $poke = $_POST["poke_id"];
    $hp = $_POST["hp"];
    $xp = $_POST["xp"];
    $name = $_POST["name"];
    // $name = strval($name);
    $money = $_POST["money"];
    $current = true;

    echo $player;

    $sql = "DELETE FROM player_poke WHERE `player_id` = $player[0]";
    $result = $conn -> query($sql);
    echo $result . "player_poke";

    $sql = "DELETE FROM player WHERE `player_id` = $player[0]";
    $result = $conn -> query($sql);
    echo $result . "player_poke";
    
    $sql = "INSERT INTO player (`player_id`, `name`, `money`, `current`) VALUES ($player[0], '$name' ,$money , $current);";
    $result = $conn -> query($sql);
    
    
    

    
    
    for($ctr = 0; $ctr < count($player); $ctr++){
        
        $sql = "INSERT INTO player_poke (player_id, poke_id, hp, xp) VALUES ($player[$ctr],$poke[$ctr], $hp[$ctr], $xp[$ctr]);";
        $result = $conn -> query($sql);
        echo $result;
    }

    
   
    CloseCon($conn);
?>