<?php
    function OpenCon()
    {
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "12345";
    $db = "cmsc433_proj3";
    $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
    
    return $conn;
    }
    
   function CloseCon($conn)
    {
    $conn -> close();
    }

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