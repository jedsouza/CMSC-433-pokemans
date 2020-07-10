<?php
    require_once "conn.php";

    $conn = OpenCon();

    $enemy = $_POST["enemy_id"];
    $poke = $_POST["poke_id"];
    $xp = $_POST["xp"];

    $sql = "DELETE FROM enemy WHERE `enemy_id` = $enemy";
    $result = $conn -> query($sql);

    
    
    for($ctr = 0; $ctr < count($poke); $ctr++){
        $sql = "INSERT INTO enemy (enemy_id, poke_id, xp) VALUES ($enemy,$poke[$ctr], $xp);";
        $result = $conn -> query($sql);
        echo $result;
    }
   
     CloseCon($conn);
?>