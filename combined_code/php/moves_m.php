<?php
require_once "conn.php";
   

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
 