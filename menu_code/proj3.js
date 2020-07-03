list = []

function newGame(){
    // document.getElementById("menu").remove()
    // document.getElementById("ng").remove()
    // document.getElementById("lg").remove()
    
}

function phpcall() {
    $.ajax({
       url:'proj3.php',
       complete: function (response) {
          //  $('#output').html(response.responseText);
          console.log("success")
       },
       error: function () {
          //  $('#output').html('Bummer: there was an error!');
          console.log("fail")
       }
   });
   return false;
 }

 function changeText(url) 
{
    // var theRequest = new XMLHttpRequest();
    // document.getElementById("change").innerHTML = "";
    // theRequest.onreadystatechange = function() {
        // if(this.readyState == 4 && this.status == 200) {
        //     // list = this.responseText;
        //     console.log(list)
        // }
        // else if(this.status == 404) {
        //     document.getElementById("change").innerHTML = "404 Error";
        // }
        // else if(this.readyState == 2) {
        //     document.getElementById("change").innerHTML += "Received</br>";
        // }
        // else if(this.readyState == 3) {
        //     document.getElementById("change").innerHTML += "Processing...</br>";
        // }
    // };
    // theRequest.open("GET", url, true);
    // theRequest.send();
}