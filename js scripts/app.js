const firebaseConfig = {
  apiKey: "AIzaSyB5NHCvCRfJfKflVnhrbW7Scet_R7nJKBU",
  authDomain: "fast-fingers-29593.firebaseapp.com",
  projectId: "fast-fingers-29593",
  storageBucket: "fast-fingers-29593.firebasestorage.app",
  messagingSenderId: "555786926627",
  appId: "1:555786926627:web:4e0321079326f7bbea0f96",
  measurementId: "G-K6CW2VPMQ7"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Access Firebase Auth
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;
let unlockedIndex;
let player_name = null;

// Track current user
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    console.log("User signed in:", user.email);
    db.collection("users").doc(user.uid).get()
    .then(doc=>{
      unlockedIndex = doc.data().unlockedIndex;
      player_name = doc.data().name;
    })
  } else {
    console.log("No user signed in.");
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (practiceInterval) {
      clearInterval(practiceInterval);
      practiceInterval = null;
    }
    player_name = null;
    window.location.replace("index.html");
  }
});

//logout//
document.querySelector(".logout").addEventListener("click", function() {
  auth.signOut().catch((error) => {
    alert("Logout error: " + error.message);
  });
})


//variables and constants//
const timeicon = '<i class="fas fa-clock icon-time"></i>';
const speedicon = '<i class="fas fa-bolt icon-speed"></i>';
const accuracyicon = '<i class="fas fa-bullseye icon-accuracy"></i>';
const historyicon = `<i class="fa-solid fa-clock-rotate-left icon-history"></i>`;

const scorecard=document.querySelector(".scorecard");
const scorecardpractice = document.querySelector(".practicescorecard");
const practicepage = document.querySelector(".practicepage");
const fillpage = document.querySelector(".fillpage");
const testpage = document.querySelector(".testpage");
const element = document.getElementById("typing-space");
const matter = document.getElementById("matter");
const element2 = document.querySelector("#practice-space");
const element3 = document.getElementById("lesson-input");
let seconds=0;
let practiceSeconds = 0;
let practiceInterval = null;
let interval = null;
let endtime = 0;
let correcttyped;
let totaltyped;
let Accuracy;
let difficulty;
let wpm;
let score;
let time;
const changesize = 20;
const windowSize = 165;
const stepSize = 1;
let currentStart;
let referenceText;
let correctWords;
let wrongwords = [];
let wpmchartcondition = null;
let accuracyChartcondition = null;
let statschartcondition = null;
let previouslength = 0;

// mode buttons//
const modes = document.querySelectorAll(".mode")
const pages = document.querySelectorAll(".page")
for(const mode of modes){
  mode.addEventListener("click", () => {
    closeMultiplayer();
    pages.forEach(page=>page.classList.add("hide"));
    modes.forEach(mode=>mode.classList.remove("selectedmode"));
    selectmode(mode);
  });
}
function selectmode(val){
  if (interval){
    clearInterval(interval);
    interval = null;
  }
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
  }
  if(multinterval){
    clearInterval(multinterval);
    multinterval = null;
  }
  let page = document.getElementById(val.innerText.trim())
  page.classList.remove("hide")
  val.classList.add("selectedmode")
  
  closeMultiplayer();
  
  if (val.innerText.trim() === "Typing Practice") {
    resetpractice();
  }
  if (val.innerText.trim() === "Your Stats") {
    selectStatsMode(document.querySelector("#statsrefresh"), "Easy");
  }
  if (val.innerText.trim() === "Leaderboard") {
    selectBoardMode(document.querySelector("#boardrefresh"), "Easy");
  }
  if (val.innerText.trim() === "Certification") {
    loadcertificate();
  }
  if (val.innerText.trim() === "Lessons"){
    document.getElementById("lesson-select").value = "lesson1";
    loadExercises("lesson1");
  }
}

//timer display//
function updateTimerDisplay(id,sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  document.getElementById(id).textContent =`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

//splitting the text into characters//
function initMatter(val,id,x) {
  let html = "";
  for (let i = 0; i < val.length; i++) {
    html += `<span class=" ${i >= windowSize ? 'hide-char' : ''}" id="${x}-${i}">${val[i]}</span>`;
  }
  document.getElementById(id).innerHTML = html;
}

//animation of text in the box//
function updateWindowForward(x) {
  for (let i = currentStart; i < currentStart + stepSize; i++) {
    const charEl = document.getElementById(`${x}-${i}`);
    if (charEl) charEl.classList.add("hide-char");
  }
  for (let i = currentStart + windowSize; i < currentStart + windowSize + stepSize; i++) {
    const charEl = document.getElementById(`${x}-${i}`);
    if (charEl) charEl.classList.remove("hide-char");
  }
  currentStart += stepSize;
}
function updateWindowBackward(x) {
  for (let i = currentStart + windowSize - stepSize; i < currentStart + windowSize; i++) {
    const charEl = document.getElementById(`${x}-${i}`);
    if (charEl) charEl.classList.add("hide-char");
  }
  for (let i = currentStart - stepSize; i < currentStart; i++) {
    const charEl = document.getElementById(`${x}-${i}`);
    if (charEl) charEl.classList.remove("hide-char");
  }
  currentStart -= stepSize;
}

//dynamic color changes of the text//
function colorCharacters(userInput,x) {
  for (let i = 0; i < referenceText.length; i++) {
    let expected = referenceText[i];
    let typed = userInput[i];
    let charSpan = document.getElementById(`${x}-${i}`);

    if (!charSpan) continue;
    charSpan.classList.remove("correct-char", "wrong-char");
    if (i < userInput.length) {
        if (typed === expected) {
            charSpan.classList.add("correct-char");
        } else {
            charSpan.classList.add("wrong-char");
        }
    }
  }
}

//keyboard events for user-input//
const wrong = new Audio("sounds/wrong.mp3");
const typing = new Audio("sounds/typing_click_fast.wav");
element.addEventListener("input", (e) => {
  startTimer();
  const typed = element.value;
  colorCharacters(typed,"char"); // update colors
  if (typed.length >= currentStart + changesize) {
    updateWindowForward("char"); // update visible range
  } else if (typed.length < currentStart+changesize && currentStart > 0) {
    updateWindowBackward("char");
  }
  if(typed.length > previouslength){
    totaltyped++;
    typing.play();
    if(typed[typed.length-1]==referenceText[typed.length-1]){
      correcttyped++;
    }else{wrong.play();}
  }
  previouslength = typed.length;
  if (typed.length >= referenceText.length) {
    finish();
  }
});
element2.addEventListener("input", (e) => {
  startPracticeTimer();
  const typed = element2.value;
  colorCharacters(typed,"pchar"); // update colors
  if (typed.length >= currentStart + changesize) {
    updateWindowForward("pchar"); // update visible range
  } else if (typed.length < currentStart+changesize && currentStart > 0) {
    updateWindowBackward("pchar");
  }
  if(typed.length > previouslength){
    totaltyped++;
    typing.play();
    if(typed[typed.length-1]==referenceText[typed.length-1]){
      correcttyped++;
    }else{wrong.play();}
  }
  previouslength = typed.length;
  if (typed.length >= referenceText.length) {
    Finishpractice();
  }
});
element3.addEventListener("input", (e) => {
  startlessonTimer();
  const typed = element3.value;
  colorCharacters(typed,"l-char"); // update colors
  if (typed.length >= currentStart + changesize) {
    updateWindowForward("l-char"); // update visible range
  } else if (typed.length < currentStart+changesize && currentStart > 0) {
    updateWindowBackward("l-char");
  }
  if(typed.length > previouslength){
    totaltyped++;
    typing.play();
    if(typed[typed.length-1]==referenceText[typed.length-1]){
      correcttyped++;
    }else{wrong.play();}
  }
  previouslength = typed.length;
  if (typed.length >= referenceText.length) {
    Finishlessonpractice();
  }
});

[element,element2,element3].forEach(el=>{
  el.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){e.preventDefault();}
  })
  el.addEventListener("paste",(e)=>{
    e.preventDefault();
  })
  el.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
  })
  el.addEventListener("click",()=>{
    el.selectionStart = el.value.length;
    el.selectionEnd = el.value.length;
  })
  el.addEventListener("keydown",()=>{
    setTimeout(()=>{
      el.selectionStart = el.value.length;
      el.selectionEnd = el.value.length;
    },0);
  })
})

//statsmode//
function loadStatsFor(level) {
  if (!currentUser) return;

  const summaryDiv = document.getElementById("stats-summary");
  const historyDiv = document.getElementById("stats-history");
  summaryDiv.innerHTML = `<p class="center-text">Loading ${level} mode stats...</p>`;
  historyDiv.innerHTML = "";
  document.getElementById("history-heading").innerHTML = `<p>Loading history...</p>`;

  db.collection(`users/${currentUser.uid}/${level} tests`)
    .where("DocType", "==", "test")
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        summaryDiv.innerHTML = `<p class="center-text">No ${level} tests taken yet.</p>`;
        document.getElementById("history-heading").innerText = `No Test History`;
        document.getElementById("showChartBtn").classList.add("hide");
        return;
      }
      document.getElementById("showChartBtn").classList.remove("hide");
      snapshot.forEach(doc => {
        const d = doc.data();
        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
          <div><strong>${speedicon}:</strong> ${d.wpm}</div>
          <div><strong>${accuracyicon}:</strong> ${d.accuracy}%</div>
          <div><strong>Score:</strong> ${d.score}</div>
          <div><strong>${timeicon}:</strong> ${new Date(d.timestamp?.toDate()).toLocaleString()}</div>
        `;
        historyDiv.appendChild(card);
        card.addEventListener("click", () => showPopup(d));
      });
      let testCount,avgAccuracy,avgWPM,avgScore,highestaccuracy,highestwpm,highestscore;
      stats = db.collection(`users/${currentUser.uid}/${level} tests`).doc("stats").get()
      .then(doc => {
        const d = doc.data();
        avgAccuracy = parseFloat(((d.correctTyped / d.totalTyped) * 100).toFixed(2));
        avgWPM = Math.floor(d.totalWords / d.totalTime);
        avgScore = parseFloat((d.totalScore / d.totalTests).toFixed(2));
        testCount = d.totalTests;
        highestaccuracy = d.highestAccuracy;
        highestwpm = d.highestWPM;
        highestscore = d.highestScore;

        summaryDiv.innerHTML = `
          <p class="stats-center-text">Total Tests: ${testCount}</p>
          <div class="avg-stats">
            <p>Avg Accuracy: ${avgAccuracy}%</p>
            <p>Avg WPM: ${avgWPM}</p>
            <p>Avg Score: ${avgScore}</p>
          </div>
          <div class="highest-stats">
            <p>Highest Accuracy: ${highestaccuracy}%</p>
            <p>Highest WPM: ${highestwpm}</p>
            <p>Highest Score: ${highestscore}</p>
          </div>
        `;
      });

      if (historyDiv.children.length > 0) {
        historyDiv.scrollTo({ top: 0, behavior: 'smooth' });
      }
      document.getElementById("history-heading").innerHTML = `${historyicon} <p>Test History</p>`;
    })
    .catch(error => {
      console.error("Error loading stats:", error);
      summaryDiv.innerHTML = `<p class="center-text" style="color:red;">Failed to load stats.</p>`;
    });
}
function selectStatsMode(val, level) {
  document.querySelectorAll(".diff-option").forEach(option => {
    option.classList.remove("selected-diff");
  });
  val.classList.add("selected-diff");

  loadStatsFor(level);
  document.querySelector(".chart-container").classList.add("hidden");
  document.getElementById('showChartBtn').innerHTML = '<i class="fa-solid fa-chart-simple"></i> Show Stats Chart';
  totalgraphs(level);
}
function showPopup(data) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup-card";
  popup.innerHTML = `
    <h3>Test Details</h3>
    <p><strong>WPM:</strong> ${data.wpm}</p>
    <p><strong>Accuracy:</strong> ${data.accuracy}%</p>
    <p><strong>Score:</strong> ${data.score}</p>
    <p><strong>Time:</strong> ${data.time} min</p>
    <p><strong>Total Typed:</strong> ${data.totaltyped}</p>
    <p><strong>Correct Typed:</strong> ${data.correcttyped}</p>
    <p><strong>Date:</strong> ${new Date(data.timestamp?.toDate()).toLocaleString()}</p>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.classList.add("popup-show");
  overlay.classList.add("popup-fade");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

//leaderboard//
function leaderboardfor(level){
  if(!currentUser) return;
  const board = document.getElementById("board");
  document.getElementById("userrank").innerText = "";
  const boardmsg = document.getElementById("board-message");
  boardmsg.innerHTML = "";
  board.innerHTML = "";
  const userdoc = db.collection('Leaderboard').doc(`${currentUser.uid}_${level}`);
  userdoc.get().then(userdoc => {
    const userdata = userdoc.data();
    if(userdata.TotalTests === 0) {
      boardmsg.innerHTML = `
        <p class="board-center-text">You have not taken any ${level} tests yet.</p>
        <p class="board-center-text">Please take a test to appear on the leaderboard.</p>
      `;
    }
    db.collection('Leaderboard').where("Difficulty", "==", level)
      .orderBy(`HighestScore`, "desc")
      .orderBy(`AvgAccuracy`,"desc")
      .get()
      .then(snapshot => {
        let rank=1;
        snapshot.forEach(doc => {
          const data = doc.data();
          if(data.TotalTests === 0) return;
          const medalIcon = rank === 1 ? '<i class="fas fa-medal" style="color: gold;"></i>'
                : rank === 2 ? '<i class="fas fa-medal" style="color: silver;"></i>'
                : rank === 3 ? '<i class="fas fa-medal" style="color: #cd7f32;"></i>'
                : '';
          const card = document.createElement("div");
          card.id = rank;
          card.className = "leaderboard-card";
          card.innerHTML = `
            <div><strong>${medalIcon} ${rank}. ${data.Name}</strong></div>
            <div><strong>${data.HighestScore}</strong></div>
          `;
          board.appendChild(card);
          if (rank === 1) {
            card.classList.add("gold-card");
          }
          else if (rank === 2) {
            card.classList.add("silver-card");
          }
          else if (rank === 3) {
            card.classList.add("bronze-card");
          }
          card.addEventListener("click", () => { BoardPopup(data,card.id);});
          
          if (userdoc.id === doc.id){
            document.getElementById("userrank").innerText = `Your Rank: ${rank}`;
          }
          rank++;
        })
      })
      .catch(error => {
        console.error("Error loading leaderboard:", error);
        board.innerHTML = `<p class="center-text" style="color:red;">Failed to load leaderboard.</p>`;
      })
  })
}
function selectBoardMode(val, level) {
  document.querySelectorAll(".lvl-option").forEach(option => {
    option.classList.remove("selected-lvl");
  });
  val.classList.add("selected-lvl");

  leaderboardfor(level);
}
function BoardPopup(data,id) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");

  if(id === "1"){
    popup.className = "popup-card gold-popup-card";
  }
  else if(id === "2"){
    popup.className = "popup-card silver-popup-card";
  }
  else if(id === "3"){
    popup.className = "popup-card bronze-popup-card";
  }
  else{
    popup.className = "popup-card";
  }
  popup.innerHTML = `
    <h3><strong>${data.Name}</strong></h3>
    <p><strong>Date Joined:</strong> ${new Date(data.Joined?.toDate()).toLocaleString()}</p>
    <p><strong>Total Tests:</strong> ${data.TotalTests}</p>
    <br>
    <div class="cardtext">
      <p><strong>Highest WPM:</strong> ${data.HighestWPM}</p>
      <p><strong>AvgWPM:</strong> ${data.AvgWPM}</p>
    </div>
    <div class="cardtext">
      <p><strong>Highest Score:</strong> ${data.HighestScore}</p>
      <p><strong>AvgScore:</strong> ${data.AvgScore}</p>
    </div>
    <div class="cardtext">
      <p><strong>Highest Accuracy:</strong> ${data.HighestAccuracy}%</p>
      <p><strong>AvgAccuracy:</strong> ${data.AvgAccuracy}%</p>
    </div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.classList.add("popup-show");
  overlay.classList.add("popup-fade");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}


//certification//
function loadcertificate() {
  db.collection("Leaderboard").doc(`${currentUser.uid}_Hard`).get()
  .then(doc => {
    const data = doc.data();
    if(data.TotalTests === 0) {
      document.querySelector("#Certification h1").innerText = "You have not taken any HARD mode tests yet.";
      document.querySelector(".cert-btn").classList.add("hide");
      document.querySelector("#cert-name").innerText = data.Name;
      document.querySelector("#cert-accuracy").innerText = ``;
      document.querySelector("#cert-wpm").innerText = ``;
    }
    else{
      document.querySelector("#Certification h1").innerText = "";
      document.querySelector(".cert-btn").classList.remove("hide");
      document.querySelector("#cert-name").innerText = data.Name;
      document.querySelector("#cert-accuracy").innerText = `${data.HighestAccuracy}%`;
      document.querySelector("#cert-wpm").innerText = `${data.HighestWPM}`;
    }

  })
}
function downloadCertificatePDF() {
  const element = document.getElementById("certificate-div");
  const certname = document.getElementById("cert-name");
  const certaccu = document.getElementById("cert-accuracy");
  const certwpm  = document.getElementById("cert-wpm");

  window.scrollTo(0, 0); // Prevent scroll from adding white space
  wrapperstyles = element.getAttribute("style");
  certnamestyles = certname.getAttribute("style");
  certaccustyles = certaccu.getAttribute("style");
  certwpmstyles = certwpm.getAttribute("style");
  element.style.width = "600px";
  element.style.height = "463px";
  element.style.padding = "10px";
  certname.style.fontSize = "1.3rem";
  certaccu.style.fontSize = "1.15rem";
  certwpm.style.fontSize = "1.15rem";

  const opt = {
    margin: 0,
    filename: currentUser.email + '-certificate.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      scrollY: 0
    },
    jsPDF: {
      unit: 'px',
      format: [620, 483],  // match actual certificate size
      orientation: 'landscape'
    }
  };

  html2pdf().set(opt).from(element).save().then(()=>{
   function resetstyle(val,id){
     if(val){
      id.setAttribute("style",val);
    } else{
      id.removeAttribute("style");
    }
   }
   resetstyle(wrapperstyles,element);
   resetstyle(certnamestyles,certname);
   resetstyle(certaccustyles,certaccu)
   resetstyle(certwpmstyles,certwpm)
  });
}

//toggle-button for mobiles//
document.getElementById('menuToggle').addEventListener('click', function() {
  const menu = document.querySelector('.modebox'); 
  menu.classList.toggle('menu-open');
})
document.querySelectorAll('.mode, .logout').forEach(function(button) {
  button.addEventListener('click', function() {
    const menu = document.querySelector('.modebox');
    menu.classList.remove('menu-open');
  });
})