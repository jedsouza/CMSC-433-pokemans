<?php
require_once "conn.php";

    $conn = OpenCon();

    // if($name == 'Igor'){
    //     echo "I'm going to mcKill myself \n";
    // }

    $sql = "SELECT * FROM player";
    $result = $conn -> query($sql);

    if ($result->num_rows > 0) {
    // output data of each row
        while($row = $result->fetch_assoc()) {
            echo $row["player_id"] . "," . $row["name"] . "," . $row["money"] . "," . $row["current"] . "\n";
        }

    } else {
        echo "0 results";
    }

    
   
    CloseCon($conn);
?>