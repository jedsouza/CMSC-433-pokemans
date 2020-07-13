
changeText("php/poke.php")
changeText("php/player.php")
pokemon = []
currentPlayerCounter = 0

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

function createPoke(img, name, type1, type2, total, hp, attack, defence, spA, spD, speed, ctr) {
    // console.log("Name!" + speed)
    toAdd = '<div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Type 1 <br /> </p>                <p class="name">' + type1 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Typ 2 <br /> </p>                <p class="name">' + type2 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Total <br /> </p>                <p class="name">' + total + '  <br /> </p>            </div>            <div class="desc">                <p class="title">HP <br /> </p>                <p class="name">' + hp + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Attack <br /> </p>                <p class="name">' + attack + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Defence <br /> </p>                <p class="name">' + defence + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Sp. Attack <br /> </p>                <p class="name">' + spA + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Sp. Defence <br /> </p>                <p class="name">' + spD + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Speed <br /> </p>                <p class="name">' + speed + '  <br /> </p>            </div>            <div class="desc">                <input type="checkbox" onclick="checkBox(' + ctr + ')" class="check_box" id="checkbox' + ctr + '" >            </div>        </div>'
    document.getElementById("poke").innerHTML += toAdd
}

function toAdd(list) {
    
    for (var ctr = 0; ctr < list.length - 1; ctr++) {
        word = list[ctr]
        word = word.split(" ")
        list[ctr] = word
        // console.log(word)
        createPoke("poke_front/poke_" + (ctr + 1) + ".png", word[1], word[2], word[3], word[4], word[5], word[6], word[7], word[8], word[9], word[10], ctr + 1)
    }

    pokemon = list
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

            if (url == "php/player.php") {
                getPlayerCounter(list)
            }
            else {
                toAdd(list)
            }

        }
    
    };
    theRequest.open("GET", url, true);
    theRequest.send();

}

function getPlayerCounter(list){
    // console.log(list)
    // if(list[0] == "0 results"){
    //     currentPlayerCounter = 1
    // }
    // else{
    //     word = list[list.length - 2]
    //     word = word.split(",")
    //     console.log(word)
    //     currentPlayerCounter = parseInt(word[0]) + 1
    //     console.log("ctr: " + currentPlayerCounter)
    // }

    max = 1

    for(var ctr = 0; ctr < list.length; ctr ++){
        word = list[ctr]
        word = word.split(",")
        console.log("num: " + word[0])
        if(word[0] > max){
            max = word[0]
        }
    }

    currentPlayerCounter = parseInt(max) + 1
}

theMap = []
countCheck = 0

function checkBox(num) {
    // console.log("name: " + document.getElementById("name").value)
    check = num
    c = document.getElementById("checkbox" + check)
    // console.log("check!!!")


    if (theMap.length == 6) {
        document.getElementById("change").innerHTML = ""
        // console.log("check")
        if (theMap.includes(check)) {
            const index = theMap.indexOf(check);
            if (index > -1) {
                theMap.splice(index, 1);
            }
        }
        else {
            document.getElementById("checkbox" + theMap[0]).checked = false
            theMap.shift()
            theMap.push(check)
        }
    }
    else {
        if (theMap.includes(check)) {
            const index = theMap.indexOf(check);
            if (index > -1) {
                theMap.splice(index, 1);
            }
        }
        else {
            theMap.push(check)
        }
    }

    if (theMap.length == 6) {
        document.getElementById("change").innerHTML += "<a onclick='initialize()' ><button >Continue</button></a>"
    }
    else {
        document.getElementById("change").innerHTML = ""
    }

    // console.log(theMap)
}

function initialize() {
    
    player_id = []
    poke_id = []
    hp = []
    xp = []
    name = document.getElementById("name").value
    if(name == ""){
        alert("Please enter a name")
        return
    }

    for (var ctr = 0; ctr < theMap.length; ctr++) {
        
        num = theMap[ctr]

        player_id.push(currentPlayerCounter)
        poke_id.push(num)
        
        hp.push(pokemon[num - 1][5])
        xp.push("1")
    }

    console.log(poke_id)

    $.ajax({
        type: "POST",  //type of method
        url: "php/send_player_poke.php",  //your page
        data: { player_id: player_id, poke_id: poke_id, xp: xp, hp: hp, name: name, money: 0 },// passing the values
        success: function (res) {
          console.log("success")             //do what you want here...
        //   $("#change").html(res);  
        }
      });


      location.replace("proj3_m.html")
}