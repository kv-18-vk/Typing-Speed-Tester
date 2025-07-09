let socket;
let playerseconds;
let NAME;
let multinterval;
let player_finished;
let oppo_finished;
let yourfinalwpm;
let yourfinalaccu;
let opfinalwpm;
let opfinalaccu;
let your_score;
let oppo_score;
let match_ended = false;
const multimatter = document.getElementById("multimatter");
const my_name = document.getElementById("username");
const mywpm = document.getElementById("userwpm");
const myaccu = document.getElementById("useraccu");
const opponame = document.getElementById("opponame");
const oppowpm = document.getElementById("oppowpm");
const oppoaccu = document.getElementById("oppoaccu");

document.getElementById("multi-btn").addEventListener("click",()=>{
    document.getElementById("Multiplayer").classList.add("hide");
    document.getElementById("Multiplayerpage").classList.remove("hide");
    startMultiplayer();
})

function startMultiplayer(){
    const element4 = document.getElementById("multispace");
    player_finished = false;
    oppo_finished = false;
    match_ended = false;
    yourfinalaccu = 0;
    yourfinalwpm = 0;
    accuracy = 0;
    wpm = 0;
    opfinalaccu = 0;
    opfinalwpm = 0;
    multinterval = null;
    playerseconds = 0;
    correctWords = 0;
    totaltyped = 0;
    correcttyped = 0;
    previouslength = 0;
    element4.value = "";
    element4.disabled = true;
    opponame.textContent = "";
    oppowpm.textContent = "";
    oppoaccu.textContent = "";
    mywpm.textContent = `WPM: ${wpm}`;
    myaccu.textContent = `Accuracy: ${accuracy}%`;
    my_name.textContent = `${player_name}`;


    socket = new WebSocket("wss://websocket-3buy.onrender.com/");

    socket.onopen = () => {
        multimatter.textContent = "Waiting for opponent......";
    };

    socket.onmessage = (e) =>{
        const data = JSON.parse(e.data);
        if (data.type == "status"){
                socket.send(JSON.stringify({type:"details",name:my_name.textContent}));
                referenceText = "ok so all the best for multiplayer, lets see who wins";
                initMatter(referenceText,"multimatter","m-char");
                multitimer();
        }
        if (data.type == "details"){
                opponame.textContent = `${data.name}`;
                oppowpm.textContent = `WPM: ${0}`;
                oppoaccu.textContent = `Accuracy: ${0}%`;
        }
        if (data.type == "stats"){
                oppowpm.textContent = `WPM: ${data.wpm}`;
                oppoaccu.textContent = `Accuracy: ${data.accuracy}%`;
        }
        if (data.type == "result"){
            oppo_finished = true;
            oppowpm.textContent = `WPM: ${data.wpm}`;
            oppoaccu.textContent = `Accuracy: ${data.accuracy}%`;
            opfinalwpm = data.wpm;
            opfinalaccu = data.accuracy;
            if(player_finished){
                match_ended = true;
                setTimeout(()=>{
                    result();
                },1000);
            }
        }
        if (data.type == "opponent_quit"){
            oppo_quit();
        }
    }
    
    element4.addEventListener("input",(e)=>{
        const typed = element4.value;
        colorCharacters(typed,"m-char");
        if(typed.length >= currentStart + changesize){
            updateWindowForward("m-char");
        } else if (typed.length < currentStart+changesize && currentStart>0){
            updateWindowBackward("m-char")
        }
        if(typed.length > previouslength){
            totaltyped++;
            typing.play();
            if(typed[typed.length-1]==referenceText[typed.length-1]){
            correcttyped++;
            }else{wrong.play();}
        }
        previouslength = typed.length;
        accuracy = parseFloat(((correcttyped/totaltyped)*100).toFixed(2));
        myaccu.textContent = `Accuracy: ${accuracy}%`;
        const typedWords = element4.value.trim().split(/\s+/);
        const refWords = referenceText.trim().split(/\s+/);
        correctWords = 0;
        for (let i = 0; i < typedWords.length; i++) {
            if (typedWords[i] === refWords[i]) {
                correctWords++;
            }
        }
        wpm = Math.floor((correctWords/playerseconds)*60);
        socket.send(JSON.stringify({type:"stats",wpm:wpm,accuracy:accuracy}));
        mywpm.textContent = `WPM: ${wpm}`;
        if (typed.length >= referenceText.length) {
            stopmultitimer();
        }
    })
    element4.addEventListener("keydown",(e)=>{
        if(e.key === "Enter"){e.preventDefault();}
    })
    element4.addEventListener("paste",(e)=>{
        e.preventDefault();
    })
    element4.addEventListener("contextmenu",(e)=>{
        e.preventDefault();
    })
    element4.addEventListener("click",()=>{
        element4.selectionStart = element4.value.length;
        element4.selectionEnd = element4.value.length;
    })
    element4.addEventListener("keydown",()=>{
        setTimeout(()=>{
            element4.selectionStart = element4.value.length;
            element4.selectionEnd = element4.value.length;
        },0);
    })



}

function closeMultiplayer() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  socket = null;
}

function multitimer(){
    if(multinterval){return;}
    document.getElementById("multispace").disabled = false;
    multinterval = setInterval(()=>{
        playerseconds++;

        if(playerseconds==60){
            stopmultitimer();
        }
    },1000);
}
function stopmultitimer(){
    if(multinterval){
        clearInterval(multinterval);
        multinterval = null;
    }
    const element4 = document.getElementById("multispace");
    element4.disabled = true;
    
    yourfinalaccu = accuracy;
    myaccu.textContent = `Accuracy: ${yourfinalaccu}%`;
    const typedWords = element4.value.trim().split(/\s+/);
    const refWords = referenceText.trim().split(/\s+/);
    correctWords = 0;
    for (let i = 0; i < typedWords.length; i++) {
        if (typedWords[i] === refWords[i]) {
            correctWords++;
        }
    }
    yourfinalwpm = Math.floor((correctWords/playerseconds)*60);
    mywpm.textContent = `WPM: ${yourfinalwpm}`;
    socket.send(JSON.stringify({type:"result",wpm:yourfinalwpm,accuracy:yourfinalaccu}));
    player_finished = true;
    if(oppo_finished){
        match_ended = true;
        setTimeout(()=>{
            result();
        },1000);
    }
}

function oppo_quit() {
  if(match_ended) return;

  document.getElementById("multispace").disabled = true;
  if(multinterval){
    clearInterval(multinterval);
    multinterval = null;
  }
  closeMultiplayer();
  const overlay = document.createElement("div");
  overlay.className = "multi-overlay";

  const popup = document.createElement("div");
  popup.className = "multi-card";

  popup.innerHTML = `
        <h3 style="color:green"> You Won </h3>
        <p> Opponent Quit </p>
  `;

  overlay.appendChild(popup);
  document.getElementById("Multiplayerpage").appendChild(overlay);
  popup.classList.add("multi-show");
  overlay.classList.add("multi-fade");

  setTimeout(()=>{
    overlay.remove();
    document.getElementById("Multiplayerpage").classList.add("hide");
    document.getElementById("Multiplayer").classList.remove("hide");
  },5000);
}

function result(){
    let restext;
    let color;
    your_score = Math.round((yourfinalaccu*yourfinalwpm)*100)/100;
    oppo_score = Math.round((opfinalaccu*opfinalwpm)*100)/100;
    closeMultiplayer();
    const overlay = document.createElement("div");
    overlay.className = "multi-overlay";

    const popup = document.createElement("div");
    popup.className = "multi-card";
    if(your_score>oppo_score){
        restext = "You Win";
        color = "green";
    }
    else if(oppo_score>your_score){
        restext = "You Lost";
        color = "red";
    }
    else{
        restext = "Match Tie";
        color = "blue";
    }
    popup.innerHTML = `
        <h3 style="color:${color}">${restext}</h3>
        <p>your score: ${your_score}</p>
        <p>opponent score: ${oppo_score}</p>
    `;
    popup.style.borderColor = color;
    overlay.appendChild(popup);
    document.getElementById("Multiplayerpage").appendChild(overlay);

    popup.classList.add("multi-show");
    overlay.classList.add("multi-fade");

    setTimeout(()=>{
        overlay.remove();
        document.getElementById("Multiplayerpage").classList.add("hide");
        document.getElementById("Multiplayer").classList.remove("hide");
    },5000);

}
