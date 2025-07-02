
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
  if (val.innerText.trim() === "Lessons"){
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


//testmode//
function SUBMIT() {
  fillpage.classList.add("hide");
  testpage.classList.remove("hide");
  document.getElementById("cancel").classList.remove("hide");
  difficulty = document.getElementById("difficulty").value;
  time = parseFloat(document.getElementById("time").value); 
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
  wrongwords = [];
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
    else{wrongwords.push([refWords[i],typedWords[i]])}
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
    updateStatsSummary(difficulty,time)
    .then(()=>{
      setTimeout(()=>{
        wpmchart(difficulty);
        renderAccuracyChart(Accuracy);
        displayerrors(wrongwords);
        document.getElementById("scoreheader").innerHTML = `<strong>Your Score: </strong>${score}`;
        document.getElementById("testresults").innerHTML = `
          ⏰ Time: ${time} min<br><br><br>
          ⌨️ Total KeyStrokes: ${totaltyped}<br><br><br>
          ✅ Correct KeyStrokes: ${correcttyped}<br><br><br>
          🔠 Correct Words: ${correctWords}<br><br><br>
          ❌ Wrong Words: ${wrongwords.length}<br><br><br>
          ⚡ WPM: ${wpm}<br>
        `;
        timerEl.classList.remove("blink");
        scorecard.classList.remove("hide");
        testpage.classList.add("hide");
        document.getElementById("loader").classList.add("hide");
      },1000);
    });
  }
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
    }else{wrongwords.push([refWords[i],typedWords[i]])}
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
    updateStatsSummary(difficulty,finishedtime)
    .then(()=>{
      setTimeout(()=>{
        wpmchart(difficulty);
        renderAccuracyChart(Accuracy);
        displayerrors(wrongwords);
        document.getElementById("scoreheader").innerHTML = `<strong>Your Score: </strong>${score}`;
        document.getElementById("testresults").innerHTML = `
          ⏰ Time: ${finishedtime} min<br><br><br>
          ⌨️ Total KeyStrokes: ${totaltyped}<br><br><br>
          ✅ Correct KeyStrokes: ${correcttyped}<br><br><br>
          🔠 Correct Words: ${correctWords}<br><br><br>
          ❌ Wrong Words: ${wrongwords.length}<br><br><br>
          ⚡ WPM: ${wpm}<br>
        `;
        timerEl.classList.remove("blink");
        scorecard.classList.remove("hide");
        testpage.classList.add("hide");
        document.getElementById("loader").classList.add("hide");
      },1000);
    })
  }
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

  return statsRef.get().then(doc => {
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

    return statsRef.update(updates).then(() => {
      return statsRef.get().then(updatedDoc => {
        const d = updatedDoc.data();
        return db.collection('Leaderboard').doc(`${currentUser.uid}_${difficulty}`).update({
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
  }, 2000);
  breakbtn.classList.add("hide");
  document.querySelector("#finish").classList.add("hide");
}

function startPracticeTimer() {
  if (practiceInterval) return; 
  breakbtn.classList.remove("hide");
  document.querySelector("#finish").classList.remove("hide");
  practiceInterval = setInterval(() => {
    practiceSeconds++;
    updateTimerDisplay("stopclock",practiceSeconds);
  }, 1000);
}

const breakbtn=document.querySelector("#break");
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
    document.querySelector("#finish").classList.add("hide");
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
element3.addEventListener("input", (e) => {
  startlessonTimer();
  const typed = element3.value;
  colorCharacters(typed,"l-char"); // update colors
  if (typed.length >= referenceText.length) {
    Finishlessonpractice();
  }
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

//graphs//
Chart.register({
  id: 'centerTextPlugin',
  beforeDraw(chart) {
    if (chart.config.options.centerText) {
      const ctx = chart.ctx;
      const text = chart.config.options.centerText.text;
      const lines = text.split('\n');
      const fontSize = chart.config.options.centerText.fontSize || '18';
      const color = chart.config.options.centerText.color || '#333';

      ctx.save();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const weight = chart.config.options.centerText.font?.weight || 'bold';
      ctx.font = `${weight} ${fontSize}px Arial`;

      const lineHeight = parseInt(fontSize) + 4;
      const centerY = chart.height / 2;
      const totalHeight = lineHeight * lines.length;
      const startY = centerY - totalHeight / 3 + lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, chart.width / 2, startY + index * lineHeight);
      });

      ctx.restore();
    }
  }
});

function wpmchart(level){
  if(wpmchartcondition){
    wpmchartcondition.destroy();
  }
  let testDatesArray = [], wpmValuesArray = [];
  const options = { month: 'long', day: 'numeric' };
  const pointcolors = ['blue','blue','blue','blue','white']

  db.collection(`users/${currentUser.uid}/${level} tests`)
  .where("DocType","==","test")
  .orderBy("timestamp","desc")
  .limit(5)
  .get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      const userdata = doc.data();
      const dateandtime = userdata.timestamp.toDate();
      testDatesArray.push([dateandtime.toLocaleDateString("en-US", options),dateandtime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })]);
      wpmValuesArray.push(userdata.wpm);
    })
  })
  .then(()=>{
    testDatesArray.reverse();
    wpmValuesArray.reverse();
    if(testDatesArray.length>0 & wpmValuesArray.length>0){
      const wpmCtx = document.getElementById('wpmChart').getContext('2d');
      wpmchartcondition = new Chart(wpmCtx, {
        type: 'line',
        data: {
          labels: testDatesArray,  
          datasets: [{
            label: 'WPM',
            data: wpmValuesArray,  
            borderColor: 'blue',
            fill: true,
            backgroundColor: 'rgba(0, 223, 216, 0.1)',
            tension: 0.3,
            pointBackgroundColor: pointcolors,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          animation: {
            duration: 0 
          },
          animations: {
            x: {
              type: 'number',
              easing: 'easeOutCubic',
              duration: 200,
              from: NaN,
              delay(ctx) {
                return ctx.index * 100;
              }
            },
            y: {
              type: 'number',
              easing: 'easeOutCubic',
              duration: 200,
              from: NaN,
              delay(ctx) {
                return ctx.index * 100;
              }
            }
          },
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 3,
              borderColor: 'blue',
              fill: false
            },
            point: {
              radius: 4,
              backgroundColor: 'blue'
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Typing Speed (WPM) Last 5 ${level} Tests`,
              color: '#333',
              padding: { bottom: 20 },
              font: { size: 18, weight: 'bold' }
            },
            legend: { display: false },
            tooltip: {
              displayColors: false,
              backgroundColor: '#111',
              titleColor: '#fff',
              bodyColor: '#00dfd8',
              padding: 10,
              borderRadius: 8,
              borderColor: '#00dfd8',
              borderWidth: 1,
              callbacks: {
                beforeLabel: function(context) {
                  const index = context.dataIndex;
                  const data = context.dataset.data;
                  if (index > 0) {
                    const diff = data[index] - data[index - 1];
                    if (diff > 0) return `📈 Increased (+${Math.floor((diff/data[index-1])*100)}%)`;
                    if (diff < 0) return `📉 Decreased (${Math.floor((diff/data[index-1])*100)}%)`;
                    return "➖Constant";
                  }
                  return '';
                },
                label: function(context) {
                  return `WPM: ${context.raw}`;
                }
              }
            }
          },
          layout: {
            padding: { left: 20 }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                color: '#0066cc',
                font: { weight: 'bold' }
              },
              border: { color: '#0066cc',width:2}
            },
            y: {
              grid: { display: false },
              ticks: {
                color: '#0066cc',
                font: { weight: 'bold' }
              },
              border: { color: '#0066cc',width:2}
            }
          }
        }

      });
    }
  })

}

function renderAccuracyChart(accuracy) {
  if (accuracyChartcondition) {
    accuracyChartcondition.destroy();
  }
  const ctx = document.getElementById("accuracyChart").getContext("2d");
  accuracyChartcondition = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [0, 100],
        backgroundColor: ['red', '#e0e0e0'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: '75%',
      rotation: 0,
      circumference: 360,
      animation: {
        animateRotate: false,
        animateScale: false,
        duration: 0
      },
      centerText: {
        text: `Accuracy\n0%`,
        fontSize: 16,
        color: '#333',
        font:{weight:'900'}
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  let current = 0;
  const steps = 120;
  const delay = 15;
  const stepVal = accuracy / steps;

  const animate = () => {
    if (current <= accuracy) {
      let color = "red";
      if (current > 90) color = "#92f97b";
      else if (current > 70) color = "orange";
      else if (current > 50) color = "yellow";

      accuracyChartcondition.data.datasets[0].data[0] = current;
      accuracyChartcondition.data.datasets[0].data[1] = 100 - current;
      accuracyChartcondition.data.datasets[0].backgroundColor[0] = color;
      accuracyChartcondition.options.centerText.text = `Accuracy\n${Math.floor(current)}%`;
      accuracyChartcondition.options.centerText.color = color;
      accuracyChartcondition.update();
      current += stepVal;
      setTimeout(animate, delay);
    } else {
      let color = "red";
      if (accuracy > 90) color = "#92f97b";
      else if (accuracy > 70) color = "orange";
      else if (accuracy > 50) color = "yellow";

      accuracyChartcondition.data.datasets[0].data[0] = accuracy;
      accuracyChartcondition.data.datasets[0].data[1] = 100 - accuracy;
      accuracyChartcondition.data.datasets[0].backgroundColor[0] = color;
      accuracyChartcondition.options.centerText.text = `Accuracy\n ${Math.floor(accuracy)}%`;
      accuracyChartcondition.options.centerText.color = color;
      accuracyChartcondition.update();
    }
  };
  animate();
}


function displayerrors(wrongwords){
  const wrongListDiv = document.getElementById("wrongwords-list");
  const wrongbox = document.getElementById("wrongwords-box");
  const titlediv = document.getElementById("titlediv");
  wrongListDiv.innerHTML = "";
  titlediv.innerHTML = "";

  if (wrongwords.length === 0) {
    wrongListDiv.innerHTML = "<strong style='color: green; text-align:center;'>All Correct 🎉</strong>";
    wrongbox.style.background = "#92f97b";
  } else {
    wrongbox.style.background = "#fff0f0";
    titlediv.innerHTML = `
      <div><strong>Expected</strong></div>
      <div><strong>Your Input</strong></div>
    `;
    wrongwords.forEach(pair => {
      const [expected, typed] = pair;
      const div = document.createElement("div");
      div.className = "wrongword-item";
      div.innerHTML = `
          <div><strong style="color:green">${expected}</strong></div>
          <div><strong style="color:red">${typed}</strong></div>
      `;
      wrongListDiv.appendChild(div);
    });
  }
}



//Lessons
const lessons = {
  lesson1: {
    title: "Lesson I - Home Row",
    exercises: [
      { id: "exercise1-1", name: "Exercise 1.1", desc: "Start by learning the two right-hand home row keys: J and K." },
      { id: "exercise1-2", name: "Exercise 1.2", desc: "Now add the remaining two right-hand keys: L and semicolon (;)." },
      { id: "exercise1-3", name: "Exercise 1.3", desc: "Let’s combine all four right-hand home row keys: J, K, L, and ;." },
      { id: "exercise1-4", name: "Exercise 1.4", desc: "Begin practicing the first two left-hand home row keys: F and D." },
      { id: "exercise1-5", name: "Exercise 1.5", desc: "Next, we’ll learn the last two left-hand home keys: S and A." },
      { id: "exercise1-6", name: "Exercise 1.6", desc: "Put together all four left-hand home keys: F, D, S, and A." },
      { id: "exercise1-7", name: "Exercise 1.7", desc: "Practice all eight home row letters: J, K, L, ;, F, D, S, and A." },
      { id: "exercise1-8", name: "Exercise 1.8", desc: "Now add the middle keys H and G to your home row practice." },
      { id: "exercise1-9", name: "Exercise 1.9", desc: "Practice all index finger letters: J, F, H, and G." },
      { id: "exercise1-10", name: "Exercise 1.10", desc: "Congratulations! You've mastered the home row — ready for the ultimate test." }
    ]
  },
  lesson2: {
    title: "Lesson II - Top Row",
    exercises: [
      { id: "exercise2-1", name: "Exercise 2.1", desc: "Learn the top row keys above the index fingers: U and R." },
      { id: "exercise2-2", name: "Exercise 2.2", desc: "Practice U and R along with the home row keys." },
      { id: "exercise2-3", name: "Exercise 2.3", desc: "Next, type the keys above your middle fingers: I and E." },
      { id: "exercise2-4", name: "Exercise 2.4", desc: "Now combine I and E with the home row." },
      { id: "exercise2-5", name: "Exercise 2.5", desc: "Use top row letters to type real words." },
      { id: "exercise2-6", name: "Exercise 2.6", desc: "Learn the ring finger top row keys: O and W." },
      { id: "exercise2-7", name: "Exercise 2.7", desc: "Practice O and W with home row combinations." },
      { id: "exercise2-8", name: "Exercise 2.8", desc: "Introduce pinky finger keys on the top row: P and Q." },
      { id: "exercise2-9", name: "Exercise 2.9", desc: "Combine P and Q with your home row letters." },
      { id: "exercise2-10", name: "Exercise 2.10", desc: "Learn the final top row keys: Y and T." },
      { id: "exercise2-11", name: "Exercise 2.11", desc: "Practice typing Y and T alongside home row letters." },
      { id: "exercise2-12", name: "Exercise 2.12", desc: "Amazing job! You’ve learned most of the alphabet." }
    ]
  },
  lesson3: {
    title: "Lesson III - Bottom Row",
    exercises: [
      { id: "exercise3-1", name: "Exercise 3.1", desc: "Type the bottom row keys under your index fingers: M and V." },
      { id: "exercise3-2", name: "Exercise 3.2", desc: "Practice typing M and V with home row support." },
      { id: "exercise3-3", name: "Exercise 3.3", desc: "Learn the keys below your middle fingers: comma (,) and C." },
      { id: "exercise3-4", name: "Exercise 3.4", desc: "Practice typing , and C alongside home row keys." },
      { id: "exercise3-5", name: "Exercise 3.5", desc: "Move on to ring finger bottom keys: period (.) and X." },
      { id: "exercise3-6", name: "Exercise 3.6", desc: "Use . and X with home row letters for better fluency." },
      { id: "exercise3-7", name: "Exercise 3.7", desc: "Introduce pinky keys on the bottom row: / and Z." },
      { id: "exercise3-8", name: "Exercise 3.8", desc: "Practice Z and / with home row integration." },
      { id: "exercise3-9", name: "Exercise 3.9", desc: "Learn the last bottom row letters: N and B." },
      { id: "exercise3-10", name: "Exercise 3.10", desc: "Practice typing N and B with home row letters." },
      { id: "exercise3-11", name: "Exercise 3.11", desc: "Fantastic! You now know the full alphabet — let’s put it to use." }
    ]
  },
  lesson4: {
    title: "Lesson IV - Capital Letters",
    exercises: [
      { id: "exercise4-1", name: "Exercise 4.1", desc: "Begin typing uppercase letters with your right hand using the left Shift key." },
      { id: "exercise4-2", name: "Exercise 4.2", desc: "Practice capitalizing left-hand letters using the right Shift key." },
      { id: "exercise4-3", name: "Exercise 4.3", desc: "Now switch between both Shift keys to type capital letters on both sides." }
    ]
  },
  lesson5: {
    title: "Lesson V - Punctuation",
    exercises: [
      { id: "exercise5-1", name: "Exercise 5.1", desc: "Let’s review four punctuation marks you’ve already used: ; , . and /." },
      { id: "exercise5-2", name: "Exercise 5.2", desc: "Now add the colon (:) to your punctuation skillset." },
      { id: "exercise5-3", name: "Exercise 5.3", desc: "Learn to type apostrophes (') and quotation marks (\")." },
      { id: "exercise5-4", name: "Exercise 5.4", desc: "Time to learn the question mark (?)." },
      { id: "exercise5-5", name: "Exercise 5.5", desc: "Now let's type the exclamation mark (!)." },
      { id: "exercise5-6", name: "Exercise 5.6", desc: "Introduce the hyphen (-) into your punctuation practice." },
      { id: "exercise5-7", name: "Exercise 5.7", desc: "You’ve mastered all punctuation marks — great work!" }
    ]
  },
  lesson6: {
    title: "Lesson VI - Numbers",
    exercises: [
      { id: "exercise6-1", name: "Exercise 6.1", desc: "Start learning numbers with the 7 and 8 keys." },
      { id: "exercise6-2", name: "Exercise 6.2", desc: "Now move on to typing 9 and 0." },
      { id: "exercise6-3", name: "Exercise 6.3", desc: "Learn to type numbers 4 and 3." },
      { id: "exercise6-4", name: "Exercise 6.4", desc: "Add numbers 1 and 2 to your practice." },
      { id: "exercise6-5", name: "Exercise 6.5", desc: "Complete the number row by adding 5 and 6." },
      { id: "exercise6-6", name: "Exercise 6.6", desc: "Now type all the numbers in a complete review." }
    ]
  },
  lesson7: {
    title: "Lesson VII - Symbols",
    exercises: [
      { id: "exercise7-1", name: "Exercise 7.1", desc: "Type the ampersand (&) and asterisk (*) symbols." },
      { id: "exercise7-2", name: "Exercise 7.2", desc: "Practice typing parentheses: ( and )." },
      { id: "exercise7-3", name: "Exercise 7.3", desc: "Work on the dollar sign ($) and the hash mark (#)." },
      { id: "exercise7-4", name: "Exercise 7.4", desc: "Learn to type the at sign (@) and exclamation point (!)." },
      { id: "exercise7-5", name: "Exercise 7.5", desc: "Type the percent symbol (%) and caret (^)." },
      { id: "exercise7-6", name: "Exercise 7.6", desc: "Review all the symbols together in one final exercise." }
    ]
  }
};

const lessonSelect = document.getElementById('lesson-select');
const exerciseContainer = document.getElementById('exercise-section');
const lessonTitle = document.getElementById('lesson-title');


function loadExercises(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return;

    lessonTitle.textContent = lesson.title;

    exerciseContainer.innerHTML = ''; 

    lesson.exercises.forEach(ex => {
        const button = document.createElement('button');
        button.id = ex.id;
        button.textContent = ex.name;
        
        const desc = document.createElement('p');
        desc.textContent = ex.desc;
        
        exerciseContainer.appendChild(button);
        exerciseContainer.appendChild(desc);
        exerciseContainer.appendChild(document.createElement('br'));
    });
}

lessonSelect.addEventListener('change', function() {
    loadExercises(lessonSelect.value);
});

let buttonId=null;
const lessonpage = document.getElementById('Lessons');
const lesson_name = document.getElementById("lesson-name");
const lessontestpage = document.getElementById('Lessontest');
const lessonmatter = document.getElementById("lesson-text");
const lessonresultspage = document.getElementById("LessonResults");
const lessonbreakbtn = document.querySelector("#lessonbreak");
exerciseContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        practiceSeconds = 0;
        element3.value = "";
        correcttyped = 0;
        totaltyped = 0;
        previouslength = 0;
        currentStart = 0;
        correctWords = 0;
        lessonbreakbtn.classList.add("hide");
        updateTimerDisplay("lessonstopclock",practiceSeconds);
        const buttonId = e.target.id;
        const lessonId = lessonSelect.value;
        const lesson = lessons[lessonId]["title"];
        lessonpage.classList.add('hide');
        lessontestpage.classList.remove('hide');
        lesson_name.innerText = `${lesson}`;
        db.collection(`Lesson-text`).doc(`${buttonId}`).get()
        .then((doc) => {
          if (doc.exists) {
            referenceText = doc.data().text;
            element3.disabled = false;
            initMatter(referenceText, "lesson-text", "l-char");
          } else {
            console.error("No such document!");
            // Handle case when document doesn't exist
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
});
function startlessonTimer() {
  if (practiceInterval) return; 
  practiceInterval = setInterval(() => {
    practiceSeconds++;
    updateTimerDisplay("lessonstopclock",practiceSeconds);
  }, 1000);
  lessonbreakbtn.classList.remove("hide");
}
function cancellesson(){
  lessonpage.classList.remove('hide');
  lessontestpage.classList.add('hide');
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
  }
  element3.value = "";
  element3.disabled = true;
  lessonmatter.innerhtml="";
}
function Finishlessonpractice() {
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
  }
  element3.disabled = true;
  lessonbreakbtn.classList.add("hide");
  const typedWords = element3.value.trim().split(/\s+/);
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
    lessontestpage.classList.add("hide");
    lessonresultspage.classList.remove("hide");
    const report = document.querySelector(".lesson-stats");
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
  }, 2000);
}
function lessonBreak() {
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
    element3.disabled = true; 
    lessonbreakbtn.textContent="resume"
  }
  else if (!practiceInterval) {
    startPracticeTimer();
    element3.disabled = false;
    lessonbreakbtn.textContent="pause"
  }
}
function lessonrestart(){
  lessonresultspage.classList.add("hide");
  lessonpage.classList.remove("hide");
}
