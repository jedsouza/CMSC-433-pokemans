
changeText("php/player.php")

setPlayerZero()
function setPlayerZero(){
    $.ajax({
        type: "POST",  //type of method
        url: "php/set_player.php",  //your page
        data: { player_id: "*", current: 0},// passing the values
        success: function (res) {
          console.log("success")             //do what you want here...
          $("#change").html(res);  
        }
      });
}

function createPlayerDis(img, name, money, ctr){
    toAdd = '<div id="current'+ ctr + '"> <div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Money <br /> </p>                <p class="name">' + money + '  <br /> </p>            </div>    <div class="desc">      <button id="sel" onclick="start(' + ctr + ')"> Select <br /> </p>            </div>     <div class="desc">    <a href="javascript:void(0)" class="closebtn" onclick="deletePlayer(' + ctr + ')">&times;</a>    </div>   </div>   </div>'
    document.getElementById("poke").innerHTML += toAdd
}

function getPlayers(list){

    for (var ctr = 0; ctr < list.length - 1; ctr++) {
        word = list[ctr]
        word = word.split(",")
        // list[ctr] = word
        // console.log(word)
        createPlayerDis("img/team_rocket.jpeg", word[1], word[2], word[0])
    }
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

function start(num){
    $.ajax({
        type: "POST",  //type of method
        url: "php/set_player.php",  //your page
        data: { player_id: num, current: 1},// passing the values
        success: function (res) {
          console.log("success")             //do what you want here...
          $("#change").html(res);  
        }
      });

    location.replace("http://localhost/project3/proj3_m.html")
}

function deletePlayer(num){
    console.log("deletePlayer")
    document.getElementById("current" + num).style.visibility = "hidden"
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