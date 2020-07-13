<?php
    require_once "conn.php";

    $conn = OpenCon();

    $player = $_POST["player_id"];

    $sql = "DELETE FROM player WHERE `player_id`=$player";
    $result = $conn -> query($sql);

    $sql = "DELETE FROM player_poke WHERE `player_id`=$player";
    $result = $conn -> query($sql);


    
   
    CloseCon($conn);
?>