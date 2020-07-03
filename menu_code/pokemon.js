

function createPoke(img, name, type1, type2, total, hp, attack, defence, spA, spD, speed, ctr){
    toAdd = '<div id="borderDemo">            <img class="front1" src=" ' + img + ' ">            <div class="desc">                <p class="title">Name <br /> </p>                <p class="name">' + name + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Type 1 <br /> </p>                <p class="name">' + type1 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Typ 2 <br /> </p>                <p class="name">' + type2 + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Total <br /> </p>                <p class="name">' + total + '  <br /> </p>            </div>            <div class="desc">                <p class="title">HP <br /> </p>                <p class="name">' + hp + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Attack <br /> </p>                <p class="name">' + attack + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Defence <br /> </p>                <p class="name">' + defence + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Sp. Attack <br /> </p>                <p class="name">' + spA + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Sp. Defence <br /> </p>                <p class="name">' + spD + '  <br /> </p>            </div>            <div class="desc">                <p class="title">Speed <br /> </p>                <p class="name">' + speed + '  <br /> </p>            </div>            <div class="desc">                <input onclick="checkBox(' + ctr + ')" type="checkbox" class="checkbox" id="checkbox' + ctr + '" name="vehicle1" value="Bike">            </div>        </div>'
    document.getElementById("poke").innerHTML += toAdd
}

function toAdd(list){
    for(var ctr = 1; ctr < list.length - 1; ctr++){
        word = list[ctr]
        word = word.split(" ")
        // console.log(word)
        createPoke("poke_front/poke_ (" + ctr + ").png",word[0],word[1],word[2],word[3],word[4],word[5],word[6],word[7],word[8],word[9], ctr)
    }
}

function changeText(url) 
{
    list = ""

    var theRequest = new XMLHttpRequest();
    document.getElementById("change").innerHTML = "";
    theRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            document.getElementById("change").innerHTML += "Complete";
            list = this.responseText;
            list = list.split("\n")
            toAdd(list)
        }
        // else if(this.status == 404) {
        //     document.getElementById("change").innerHTML = "404 Error";
        // }
        // else if(this.readyState == 2) {
        //     document.getElementById("change").innerHTML += "Received</br>";
        // }
        // else if(this.readyState == 3) {
        //     document.getElementById("change").innerHTML += "Processing...</br>";
        // }
    };
    theRequest.open("GET", url, true);
    theRequest.send();

}

theMap = []
countCheck = 0

function checkBox(num){
    
    check = "checkbox" + num
    c = document.getElementById(check)

    if(c.checked){
        console.log("success")
    }
    else{
        console.log("failed")
    }

    
    if(theMap.length == 6){
        if(theMap.includes(check)){
            const index = theMap.indexOf(check);
            if (index > -1) {
                theMap.splice(index, 1);
            }
        }
        else{
            document.getElementById(theMap[0]).checked = false
            theMap.shift()
            theMap.push(check)
        }
    }
    else{
        if (theMap.includes(check)) {
            const index = theMap.indexOf(check);
            if (index > -1) {
                theMap.splice(index, 1);
            }
        }
        else{
            theMap.push(check)
        }
    }
    
    console.log(theMap)
}