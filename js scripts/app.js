
const firebaseConfig = {
  apiKey: "AIzaSyAlt8DEsHBtgsw2Dvuqt41oebpezAXTOBI",
  authDomain: "tutorial-700bd.firebaseapp.com",
  databaseURL: "https://tutorial-700bd-default-rtdb.firebaseio.com",
  projectId: "tutorial-700bd",
  storageBucket: "tutorial-700bd.firebasestorage.app",
  messagingSenderId: "1020008362522",
  appId: "1:1020008362522:web:5bc97cd35094b169ca57a3"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Access Firebase Auth
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;

// Track current user
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    console.log("User signed in:", user.email);
  } else {
    console.log("No user signed in.");
  }
});

//logout//
document.querySelector(".logout").addEventListener("click", function() {
  auth.signOut().then(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (practiceInterval) {
      clearInterval(practiceInterval);
      practiceInterval = null;
    }
    window.location.href = "index.html";
  }).catch((error) => {
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
let backspace = true;
let previouslength = 0;

// mode buttons//
const modes = document.querySelectorAll(".mode")
const pages = document.querySelectorAll(".page")
for(const mode of modes){
  mode.addEventListener("click", () => {
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
  let page = document.getElementById(val.innerText.trim())
  page.classList.remove("hide")
  val.classList.add("selectedmode")
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


//testmode//
function SUBMIT() {
  fillpage.classList.add("hide");
  testpage.classList.remove("hide");
  document.getElementById("cancel").classList.remove("hide");
  difficulty = document.getElementById("difficulty").value;
  time = parseInt(document.getElementById("time").value); 
  seconds = time * 60; 
  updateTimerDisplay("timer",seconds);
  document.getElementById("modedisplay").innerText = difficulty;
  element.value = "";
  correcttyped = 0;
  totaltyped = 0;
  currentStart = 0;
  previouslength = 0;
  correctWords = 0;
  backspace = true;
  endtime = 0;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  const randomInt = Math.floor(Math.random() * 5) + 1;
  db.collection("Typing-paragraphs").doc(`${difficulty}-${randomInt}`).get()
    .then((doc) => {
        referenceText = doc.data().Text;
        element.disabled = false;
        initMatter(referenceText,"matter","char");
        instructionpopup();
    })
}

function CANCEL() {
  fillpage.classList.remove("hide");
  testpage.classList.add("hide");

  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  element.value = "";
  element.disabled = true;
  matter.innerhtml="";
}

const countdown = new Audio("sounds/5seconds.mp3");

function startTimer() {
  if (interval || seconds <= 0) return;

  interval = setInterval(() => {
    seconds--;
    updateTimerDisplay("timer",seconds);

    if (seconds <= 0) {
      STOP();
    }
    if (seconds == 5){
      countdown.play();
    }
  }, 1000);
}

function STOP() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  countdown.pause(); 
  countdown.currentTime = 0;
  endtime = seconds;
  element.disabled = true;
  const typedWords = element.value.trim().split(/\s+/);
  const refWords = referenceText.trim().split(/\s+/);
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === refWords[i]) {
      correctWords++;
    }
  }
  Accuracy = parseFloat(((correcttyped/totaltyped)*100).toFixed(2));
  wpm = Math.floor(correctWords/time);
  score = parseFloat((wpm*Accuracy).toFixed(2));
  document.getElementById("cancel").classList.add("hide");
  const timerEl = document.getElementById("timer");
  timerEl.textContent = "TimeUp";
  timerEl.classList.add("blink");
  document.getElementById("loader").classList.remove("hide");
  if (currentUser) {
    addtesthistory(difficulty,time);
    updateStatsSummary(difficulty,time);

  }
  setTimeout(() => {
    timerEl.classList.remove("blink");
    scorecard.classList.remove("hide");
    testpage.classList.add("hide");

    const report = document.querySelector(".stats");
    report.innerHTML = `
      Time: ${time} min<br>
      Difficulty: ${difficulty}<br>
      Total Typed Characters: ${totaltyped}<br>
      Correct Typed Characters: ${correcttyped}<br>
      Accuracy: ${Accuracy}%<br>
      WPM: ${wpm}<br>
      Score: ${score}<br>
      Timestamp: ${new Date().toLocaleString()}
    `;
    document.getElementById("loader").classList.add("hide");
  }, 6000);
}
function finish() {
    if (interval) {
    clearInterval(interval);
    interval = null;
  }
  countdown.pause();
  countdown.currentTime = 0;
  endtime = seconds;
  element.disabled = true;
  const typedWords = element.value.trim().split(/\s+/);
  const refWords = referenceText.trim().split(/\s+/);
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === refWords[i]) {
      correctWords++;
    }
  }
  Accuracy = parseFloat(((correcttyped/totaltyped)*100).toFixed(2));
  let finishedtime = time - (endtime/60);
  wpm = Math.floor(correctWords/finishedtime);
  score = parseFloat((wpm*Accuracy).toFixed(2));
  document.getElementById("cancel").classList.add("hide");
  const timerEl = document.getElementById("timer");
  timerEl.textContent = "Finished";
  timerEl.classList.add("blink");
  document.getElementById("loader").classList.remove("hide");
  if (currentUser) {
    addtesthistory(difficulty,finishedtime);
    updateStatsSummary(difficulty,finishedtime);
  }

  setTimeout(() => {
    timerEl.classList.remove("blink");
    scorecard.classList.remove("hide");
    testpage.classList.add("hide");
  
    const report = document.querySelector(".stats");
      report.innerHTML = `
      Time: ${parseFloat(finishedtime.toFixed(2))} min<br>
      Difficulty: ${difficulty}<br>
      Total Typed Characters: ${totaltyped}<br>
      Correct Typed Characters: ${correcttyped}<br>
      Accuracy: ${Accuracy}%<br>
      Correct Words Typed: ${correctWords}<br>
      WPM: ${wpm}<br>
      Score: ${score}<br>
      Timestamp: ${new Date().toLocaleString()}
    `;
    document.getElementById("loader").classList.add("hide");
  }, 6000);
}
function addtesthistory(difficulty, time){
  db.collection(`users/${currentUser.uid}/${difficulty} tests`).add({
      time: time,
      difficulty: difficulty,
      totaltyped: totaltyped,
      correcttyped: correcttyped,
      accuracy: Accuracy,
      wpm: wpm,
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      DocType: "test",
    })
    db.collection("users").doc(currentUser.uid).update({
      [`Total${difficulty}Tests`]: firebase.firestore.FieldValue.increment(1)
    });
}
function updateStatsSummary(difficulty, time) {
  const statsRef = db.collection(`users/${currentUser.uid}/${difficulty} tests`).doc("stats");

  statsRef.get().then(doc => {
    const data = doc.data();
    const updates = {
      totalTests: firebase.firestore.FieldValue.increment(1),
      totalTyped: firebase.firestore.FieldValue.increment(totaltyped),
      correctTyped: firebase.firestore.FieldValue.increment(correcttyped),
      totalTime: firebase.firestore.FieldValue.increment(time),
      totalWords: firebase.firestore.FieldValue.increment(correctWords),
      totalScore: firebase.firestore.FieldValue.increment(score),
      highestAccuracy: Math.max(Accuracy, data.highestAccuracy),
      highestWPM: Math.max(wpm, data.highestWPM),
      highestScore: Math.max(score, data.highestScore)
    };

    statsRef.update(updates).then(() => {
      statsRef.get().then(updatedDoc => {
        const d = updatedDoc.data();
        db.collection('Leaderboard').doc(`${currentUser.uid}_${difficulty}`).update({
          AvgAccuracy: parseFloat(((d.correctTyped / d.totalTyped) * 100).toFixed(2)),
          AvgWPM: Math.floor(d.totalWords / d.totalTime),
          AvgScore: parseFloat((d.totalScore / d.totalTests).toFixed(2)),
          TotalTests: d.totalTests,
          HighestAccuracy: d.highestAccuracy,
          HighestWPM: d.highestWPM,
          HighestScore: d.highestScore
        });
      });
    });
  });
}

function restartTest(){
  scorecard.classList.add("hide");
  fillpage.classList.remove("hide");
}


//practice mode//
function Finishpractice() {
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
  }

  element2.disabled = true;
  const typedWords = element2.value.trim().split(/\s+/);
  const refWords = referenceText.trim().split(/\s+/);
  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === refWords[i]) {
      correctWords++;
    }
  }
  let minutes = practiceSeconds / 60;
  Accuracy = parseFloat(((correcttyped / totaltyped) * 100).toFixed(2));
  wpm = Math.floor(correctWords / minutes);
  score = wpm*Accuracy;

  const timerEl = document.getElementById("stopclock");
  timerEl.textContent = "Finished";
  timerEl.classList.add("blink");
  document.getElementById("loader").classList.remove("hide");

  setTimeout(() => {
    timerEl.classList.remove("blink");
    practicepage.classList.add("hide");
    scorecardpractice.classList.remove("hide");

    const report = document.querySelector(".practicestats");
    report.innerHTML = `
      Time:  ${Math.floor(minutes)} min : ${practiceSeconds%60} sec<br>
      Total Typed Characters: ${totaltyped}<br>
      Correct Typed Characters: ${correcttyped}<br>
      Accuracy: ${Accuracy}%<br>
      Correct Words Typed: ${correctWords}<br>
      WPM: ${wpm}<br>
      Score: ${score}<br>
      Timestamp: ${new Date().toLocaleString()}
    `;
    document.getElementById("loader").classList.add("hide");
  }, 6000);
  breakbtn.classList.add("hide");
  document.querySelector(".finish").classList.add("hide");
}

function startPracticeTimer() {
  if (practiceInterval) return; 
  breakbtn.classList.remove("hide");
  document.querySelector(".finish").classList.remove("hide");
  practiceInterval = setInterval(() => {
    practiceSeconds++;
    updateTimerDisplay("stopclock",practiceSeconds);
  }, 1000);
}

const breakbtn=document.querySelector(".break");
function Break() {
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
    element2.disabled = true; 
    breakbtn.textContent="resume"
  }
  else if (!practiceInterval) {
    startPracticeTimer();
    element2.disabled = false;
    breakbtn.textContent="pause"
  }
}
function restartPractice(){
  scorecardpractice.classList.add("hide");
  practicepage.classList.remove("hide");
  resetpractice();
}
function resetpractice() {
    practiceSeconds = 0;
    element2.value = "";
    correcttyped = 0;
    totaltyped = 0;
    previouslength = 0;
    currentStart = 0;
    correctWords = 0;
    const randomInt = Math.floor(Math.random() * 5) + 1;
    db.collection("practice-paragraphs").doc(`Practice-${randomInt}`).get()
    .then((doc) => {
        referenceText = doc.data().text;
        element2.disabled = false;
        initMatter(referenceText,"practicematter","pchar");
    })
    updateTimerDisplay("stopclock",practiceSeconds);
    breakbtn.classList.add("hide");
    document.querySelector(".finish").classList.add("hide");
}


//keyboard events for user-input//
const wrong = new Audio("sounds/wrong.mp3");
const typing = new Audio("sounds/typing_click_fast.wav");
element.addEventListener("input", (e) => {
  startTimer();
  const typed = element.value;
  colorCharacters(typed,"char"); // update colors
  if (typed.length >= referenceText.length) {
    finish();
  }
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
});
element2.addEventListener("input", (e) => {
  startPracticeTimer();
  const typed = element2.value;
  colorCharacters(typed,"pchar"); // update colors
  if (typed.length >= referenceText.length) {
    Finishpractice();
  }
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
});
[element,element2].forEach(el=>{
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
        return;
      }
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
      document.querySelector("#cert-accuracy").innerText = `${data.AvgAccuracy}%`;
      document.querySelector("#cert-wpm").innerText = `${data.AvgWPM}`;
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

//instructions in testmode//
function instructionpopup(){
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "instruct-card";
  
  popup.innerHTML = `
    <h3><strong>Instructions</strong></h3>
    <p><strong>> The timer starts when you try to enter  in  the typing space below</strong></p>
    <p><strong>> Timer will be stopped only in the case of :</strong></p>
    <ul>
	      <li>completion of words</li>
	      <li>after finishing the  given time</li>
    </ul>
    <p><strong>> If you try switching to other modes in website(i.e going to practice or stats while doing test)leads to losing your progress in the current mode</strong></p>
    <p><strong>> Be careful while typing</strong></p>
    <ul>
        <li>The given sentence should be completely identical to your typed text(i.e spaces, punctuations)</li>
	      <ul>
           <li>I am handsome.</li>
	         <li>Iam handsome.[give your wpm as 0]</li>
        </ul>
    </ul>
    <p><strong>> Your score is equal to wpm*accuracy</strong></p>
    <ul>
	      <li>score=wpm*accuracy</li>
        <li>Please correct your mistakes to achieve a good score.</li>
    </ul>
    <p><strong>> We hope your test goes planned as per your strategies</strong></p>
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
