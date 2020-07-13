<?php

require_once "conn.php";



$conn = OpenCon();

$sql = "SELECT * FROM `player_poke`";
$result = $conn -> query($sql);



if ($result->num_rows > 0) {
   // output data of each row
   while($row = $result->fetch_assoc()) {
     
     echo $row["player_id"], ",", $row["poke_id"], ",", $row["hp"], ",", $row["xp"] , "\n";
     
   }
 } else {
   echo "0 results";
 }

 CloseCon($conn);

?>