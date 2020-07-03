<?php
include('classes.php');
$array = [];
// echo "<script>console.log('test1')</script>";

// Open the file for reading
if (($h = fopen("poke.csv", "r")) !== FALSE) 
{
  // Convert each line into the local $data variable
  while (($data = fgetcsv($h, 1000, ",")) !== FALSE) 
  {		
    // Read the data from a single line
    echo $data[0],$data[1],$data[2],$data[3],$data[4],$data[5],$data[6],$data[7],$data[8],$data[9],$data[10],$data[11],$data[12], "\n";
    array_push($array, new Pokemon($data[0],$data[1],$data[2],$data[3],$data[4],$data[5],$data[6],$data[7],$data[8],$data[9],$data[10],$data[11],$data[12]));

  }

  // Close the file
  fclose($h);
}

?>