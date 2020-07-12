
function deletePlayer(num){
    console.log("deletePlayer")
    // document.getElementById("current" + num).style.visibility = "hidden"
    $.ajax({
        type: "POST",  //type of method
        url: "php/deletePlayer.php",  //your page
        data: { player_id: num},// passing the values
        success: function (res) {
          console.log("success")             //do what you want here...
          $("#change").html(res);  
        }
      });
}

function getPlayers(list){

    for (var ctr = 0; ctr < list.length - 1; ctr++) {
        word = list[ctr]
        word = word.split(",")
        if(word[3] == "1"){
            deletePlayer(word[0])
        }
    }
}

function removePlayer(){
    changeText("php/player.php")
}

function changeText(url) {
    list = ""

    var theRequest = new XMLHttpRequest();
    console.log(url)
    theRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // document.getElementById("change").innerHTML += "Complete";
            list = this.responseText;
            list = list.split("\n")

            getPlayers(list)

        }
    
    };
    theRequest.open("GET", url, true);
    theRequest.send();

}