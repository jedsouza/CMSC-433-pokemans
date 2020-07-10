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
 $sql = "SELECT * FROM moves_1";

 $result = $conn -> query($sql);

 if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      echo $row["move_id"] . "," . $row["Name"] . "," . $row["Type"] . "," . $row["Category"] . "," . $row["PP"] . "," . $row["Power"] . "," . $row["Accuracy"] . "\n";
    }
  } else {
    echo "0 results";
  }

  CloseCon($conn);

  ?>
 