<?php
require_once "conn.php";

 $conn = OpenCon();
 $sql = "SELECT * FROM enemy";

 $result = $conn -> query($sql);

 if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      echo $row["enemy_id"] . "," . $row["poke_id"] . "," . $row["xp"] . "\n";
    }
  } else {
    echo "0 results";
  }

  CloseCon($conn);

  ?>
 