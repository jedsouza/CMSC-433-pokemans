<?php
require_once "conn.php";

 $conn = OpenCon();
 $sql = "SELECT * FROM poke_moves";
 
 $result = $conn -> query($sql);

 if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      echo $row["poke_id"] . "," . $row["move_id"] . "\n";
    }
  } else {
    echo "0 results";
  }

  CloseCon($conn);

  ?>
 