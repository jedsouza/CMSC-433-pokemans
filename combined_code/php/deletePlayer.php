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

    $player = $_POST["player_id"];

    $sql = "DELETE FROM player WHERE `player_id`=$player";
    $result = $conn -> query($sql);

    $sql = "DELETE FROM player_poke WHERE `player_id`=$player";
    $result = $conn -> query($sql);


    
   
    CloseCon($conn);
?>