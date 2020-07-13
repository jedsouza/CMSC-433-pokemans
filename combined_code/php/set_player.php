<?php
    require_once "conn.php";

    $conn = OpenCon();

    $player = $_POST["player_id"];
    $current = $_POST["current"];

    // if($name == 'Igor'){
    //     echo "I'm going to mcKill myself \n";
    // }
    if($player == "*"){
        $sql = "UPDATE player SET `current` = $current";
    }
    else{
        $sql = "UPDATE player SET `current` = $current WHERE `player_id` = $player;";
    }
    $result = $conn -> query($sql);
   
    CloseCon($conn);
?>