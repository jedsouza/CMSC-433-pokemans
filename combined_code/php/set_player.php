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