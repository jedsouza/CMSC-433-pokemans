<?php
    require_once "conn.php";

    $conn = OpenCon();

    $sql = "DELETE FROM player_poke WHERE `player_id` = 1";
    $result = $conn -> query($sql);

    
    $player = $_POST["player_id"];
    $poke = $_POST["poke_id"];
    $hp = $_POST["hp"];
    $xp = $_POST["xp"];
    
    for($ctr = 0; $ctr < count($player); $ctr++){
        $sql = "INSERT INTO player_poke (player_id, poke_id, hp, xp) VALUES ($player[$ctr],$poke[$ctr], $hp[$ctr], $xp[$ctr]);";
        $result = $conn -> query($sql);
        echo $result;
    }
   
     CloseCon($conn);
?>