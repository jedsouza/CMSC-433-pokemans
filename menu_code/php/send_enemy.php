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

    $enemy = $_POST["enemy_id"];
    $poke = $_POST["poke_id"];

    $sql = "DELETE FROM enemy WHERE `enemy_id` = $enemy";
    $result = $conn -> query($sql);

    
    
    for($ctr = 0; $ctr < count($poke); $ctr++){
        $sql = "INSERT INTO enemy (enemy_id, poke_id) VALUES ($enemy,$poke[$ctr]);";
        $result = $conn -> query($sql);
        echo $result;
    }
   
     CloseCon($conn);
?>