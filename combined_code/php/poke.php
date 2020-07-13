<?php
include('classes.php');
$array = [];
// echo "<script>console.log('test1')</script>";

// // Open the file for reading
// if (($h = fopen("poke.csv", "r")) !== FALSE) 
// {
//   // Convert each line into the local $data variable
//   while (($data = fgetcsv($h, 1000, ",")) !== FALSE) 
//   {		
//     // Read the data from a single line
//     echo $data[0],$data[1],$data[2],$data[3],$data[4],$data[5],$data[6],$data[7],$data[8],$data[9],$data[10],$data[11],$data[12], "\n";
//     array_push($array, new Pokemon($data[0],$data[1],$data[2],$data[3],$data[4],$data[5],$data[6],$data[7],$data[8],$data[9],$data[10],$data[11],$data[12]));

//   }

//   // Close the file
//   fclose($h);
// }

require_once "conn.php";
   

 $conn = OpenCon();
 $sql = "SELECT `poke_id`, ` Name`, ` Type 1`, ` Type 2`, ` Total`,` HP`, ` Attack`, ` Defense`, ` Sp. Atk`, ` Sp. Def`, ` Speed` FROM poke_2";
//  echo "Connected Successfully" . "<br>";
 $result = $conn -> query($sql);
 $ctr = 1;
 if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
      // echo "id: " . $row["poke_id"]. " - Name: " . $row["NAME"]. " " . $row["Sp. Atk"]. "<br>";
      echo $row["poke_id"],$row[" Name"],$row[" Type 1"],$row[" Type 2"],$row[" Total"],$row[" HP"],$row[" Attack"],$row[" Defense"],$row[" Sp. Atk"],$row[" Sp. Def"],$row[" Speed"], "\n";
      // array_push($array, new Pokemon($row["poke_id"],$row[" Name"],$row[" Type 1"],$row[" Type 2"],$row[" Total"],$row[" HP"],$row[" Attack"],$row[" Defense"],$row[" Sp. Atk"],$row[" Sp. Def"],$row[" Speed"]));
      $ctr = $ctr + 1;
    }
  } else {
    echo "0 results";
  }

  CloseCon($conn);


?>