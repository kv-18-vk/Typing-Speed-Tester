
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

let loginPage = document.querySelector(".login-form");
let registerPage = document.querySelector(".register-form");

document.querySelector(".register").addEventListener("click", function () {
  const name = document.querySelector("#regName").value;
  const username = document.querySelector("#regUsername").value;
  const password = document.querySelector("#regPassword").value;
  const confirmPassword = document.querySelector("#regConfirmPassword").value;

  if (!name || !username || !password || !confirmPassword) {
    alert("Please fill all the details.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (localStorage.getItem(username)) {
    alert("Username already exists. Please choose another.");
    return;
  }

  auth.createUserWithEmailAndPassword(username,password)
   .then((userCredential) => {
      const user=userCredential.user

      db.collection("users").doc(user.email).set({
        uid : user.uid,
        name: name,
        TotalEasyTests: 0,
        TotalMediumTests: 0,
        TotalHardTests: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      const difficulties = ["Easy", "Medium", "Hard"];
      const Data = {
        totalTests: 0,
        totalTyped: 0,
        correctTyped: 0,
        totalTime: 0,
        totalWords: 0,
        totalScore: 0,
        highestAccuracy: 0,
        highestWPM: 0,
        highestScore: 0,
        DocType: "stats"
      };
      difficulties.forEach(diff => {
        db.collection(`users/${user.email}/${diff} tests`).doc("stats").set(Data);
        db.collection('Leaderboard').doc(`${user.email}_${diff}`).set({
          Name: name,
          Joined: firebase.firestore.FieldValue.serverTimestamp(),
          Difficulty: diff,
          AvgAccuracy: 0,
          AvgWPM: 0,
          AvgScore: 0,
          TotalTests: 0,
          HighestAccuracy: 0,
          HighestWPM: 0,
          HighestScore: 0
        });
      });

      alert("Registration successful! Please login.");
      registerPage.classList.add("hide");
      loginPage.classList.remove("hide");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    })
});

function bodychange(val) {
    document.body.style.backgroundImage = val;
    document.body.style.backgroundSize = "cover"; 
    document.body.style.backgroundRepeat = "no-repeat"; 
}

document.querySelector(".login").addEventListener("click", function () {
  const username = document.querySelector("#loginUsername").value.trim();
  const password = document.querySelector("#loginPassword").value;

  if (!username || !password) {
    alert("Please enter the details.");
    return;
  }

 auth. signInWithEmailAndPassword( username, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.querySelector(".container").classList.add("hide");
      document.querySelector(".flex").classList.remove("hide");
      document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hide");
      });
      document.querySelectorAll(".mode").forEach(mode => {
        mode.classList.remove("selectedmode");
      });
      document.querySelector(".fillpage").classList.remove("hide");
      document.querySelector(".modebox button").classList.add("selectedmode");
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

document.querySelector(".registernew").addEventListener("click", function () {
  loginPage.classList.add("hide");
  registerPage.classList.remove("hide");
});
document.querySelector(".log").addEventListener("click", function () {
  registerPage.classList.add("hide");
  loginPage.classList.remove("hide");
});

document.querySelector("#logout").addEventListener("click", function() {
  auth.signOut().then(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (practiceInterval) {
      clearInterval(practiceInterval);
      practiceInterval = null;
    }
    document.querySelector(".container").classList.remove("hide");
    document.querySelector(".flex").classList.add("hide");
    document.querySelector("#loginUsername").value = "";
    document.querySelector("#loginPassword").value = "";
  }).catch((error) => {
    alert("Logout error: " + error.message);
  });
})






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

function updateTimerDisplay(id,sec) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  document.getElementById(id).textContent =`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

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
  correctWords = 0;
  endtime = 0;
  db.collection("Typing-paragraphs").doc(difficulty).get()
    .then((doc) => {
        referenceText = doc.data().Text;
        element.disabled = false;
        initMatter(referenceText,"matter","char");
    })
  
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
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

function startTimer() {
  if (interval || seconds <= 0) return;

  interval = setInterval(() => {
    seconds--;
    updateTimerDisplay("timer",seconds);

    if (seconds <= 0) {
      STOP();
    }
  }, 1000);
}

function STOP() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  endtime = seconds;
  element.disabled = true;
  Accuracy = parseFloat(((correcttyped/totaltyped)*100).toFixed(2));
  wpm = Math.floor(correctWords/time);
  score = parseFloat((wpm*Accuracy).toFixed(2));
  document.getElementById("cancel").classList.add("hide");
  const timerEl = document.getElementById("timer");
  timerEl.textContent = "TimeUp";
  timerEl.classList.add("blink");
  
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
  }, 2000);
}
function finish() {
    if (interval) {
    clearInterval(interval);
    interval = null;
  }
  endtime = seconds;
  element.disabled = true;
  Accuracy = parseFloat(((correcttyped/totaltyped)*100).toFixed(2));
  let finishedtime = time - (endtime/60);
  wpm = Math.floor(correctWords/finishedtime);
  score = parseFloat((wpm*Accuracy).toFixed(2));
  document.getElementById("cancel").classList.add("hide");
  const timerEl = document.getElementById("timer");
  timerEl.textContent = "Finished";
  timerEl.classList.add("blink");

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
  }, 2000);
}
function addtesthistory(difficulty, time){
  db.collection(`users/${currentUser.email}/${difficulty} tests`).add({
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
    db.collection("users").doc(currentUser.email).update({
      [`Total${difficulty}Tests`]: firebase.firestore.FieldValue.increment(1)
    });
}
function updateStatsSummary(difficulty, time) {
  const statsRef = db.collection(`users/${currentUser.email}/${difficulty} tests`).doc("stats");

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
        db.collection('Leaderboard').doc(`${currentUser.email}_${difficulty}`).update({
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


function Finishpractice() {
  if (practiceInterval) {
    clearInterval(practiceInterval);
    practiceInterval = null;
  }

  element2.disabled = true;

  let minutes = practiceSeconds / 60;
  Accuracy = parseFloat(((correcttyped / totaltyped) * 100).toFixed(2));
  wpm = Math.floor(correctWords / minutes);
  score = wpm*Accuracy;

  const timerEl = document.getElementById("stopclock");
  timerEl.textContent = "Finished";
  timerEl.classList.add("blink");

  setTimeout(() => {
    timerEl.classList.remove("blink");
    practicepage.classList.add("hide");
    scorecardpractice.classList.remove("hide");

    const report = document.querySelector(".practicestats");
    report.innerHTML = `
      Time: ${parseFloat(minutes.toFixed(2))} min<br>
      Total Typed Characters: ${totaltyped}<br>
      Correct Typed Characters: ${correcttyped}<br>
      Accuracy: ${Accuracy}%<br>
      Correct Words Typed: ${correctWords}<br>
      WPM: ${wpm}<br>
      Score: ${score}<br>
      Timestamp: ${new Date().toLocaleString()}
    `;
  }, 2000);
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
    currentStart = 0;
    correctWords = 0;
    const randomInt = Math.floor(Math.random() * 1) + 1;
    db.collection("practice-paragraphs").doc(`practice-${randomInt}`).get()
    .then((doc) => {
        referenceText = doc.data().text;
        element2.disabled = false;
        initMatter(referenceText,"practicematter","pchar");
    })
    updateTimerDisplay("stopclock",practiceSeconds);
    breakbtn.classList.add("hide");
    document.querySelector(".finish").classList.add("hide");
}


// mode buttons 
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


// keyboard event --- timer 




function initMatter(val,id,x) {
  let html = "";
  for (let i = 0; i < val.length; i++) {
    html += `<span class=" ${i >= windowSize ? 'hide-char' : ''}" id="${x}-${i}">${val[i]}</span>`;
  }
  document.getElementById(id).innerHTML = html;
}

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




function colorCharacters(userInput,x) {
  correcttyped = 0;
  for (let i = 0; i < referenceText.length; i++) {
    let expected = referenceText[i];
    let typed = userInput[i];
    let charSpan = document.getElementById(`${x}-${i}`);

    if (!charSpan) continue;
    charSpan.classList.remove("correct-char", "wrong-char");
    if (i < userInput.length) {
        if (typed === expected) {
            charSpan.classList.add("correct-char");
            correcttyped++
        } else {
            charSpan.classList.add("wrong-char");
        }
    }
  }

  const typedWords = userInput.trim().split(/\s+/);
  const refWords = referenceText.trim().split(/\s+/);
  correctWords = 0;

  for (let i = 0; i < typedWords.length; i++) {
    if (typedWords[i] === refWords[i]) {
      correctWords++;
    }
  }
}



element.addEventListener("input", () => {
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
});

element.addEventListener("keydown", function (event) {
    if (event.key.length === 1 || event.key === " ") {
        totaltyped++;
    } 
    if (event.key === "Enter"){
        event.preventDefault();
    }
});



element2.addEventListener("input", () => {
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
});

element2.addEventListener("keydown", function (event) {
    if (event.key.length === 1 || event.key === " ") {
        totaltyped++;
    } 
    if (event.key === "Enter"){
        event.preventDefault();
    }
});

function loadStatsFor(level) {
  if (!currentUser) return;

  const summaryDiv = document.getElementById("stats-summary");
  const historyDiv = document.getElementById("stats-history");
  summaryDiv.innerHTML = `<p class="center-text">Loading ${level} mode stats...</p>`;
  historyDiv.innerHTML = "";
  document.getElementById("history-heading").innerText = `Loading history...`;

  db.collection(`users/${currentUser.email}/${level} tests`)
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
          <div><strong>WPM:</strong> ${d.wpm}</div>
          <div><strong>Accuracy:</strong> ${d.accuracy}%</div>
          <div><strong>Score:</strong> ${d.score}</div>
          <div><strong>Time:</strong> ${new Date(d.timestamp?.toDate()).toLocaleString()}</div>
        `;
        historyDiv.appendChild(card);
        card.addEventListener("click", () => showPopup(d));
      });
      let testCount,avgAccuracy,avgWPM,avgScore,highestaccuracy,highestwpm,highestscore;
      stats = db.collection(`users/${currentUser.email}/${level} tests`).doc("stats").get()
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
          <p class="center-text">Total Tests: ${testCount}</p>
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
      document.getElementById("history-heading").innerText = `Test History`;
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

function leaderboardfor(level){
  if(!currentUser) return;
  const board = document.getElementById("board");
  const boardmsg = document.getElementById("board-message");
  board.innerHTML = "";
  const userdoc = db.collection('Leaderboard').doc(`${currentUser.email}_${level}`);
  userdoc.get().then(doc => {
    const data = doc.data();
    if(data.TotalTests === 0) {
      boardmsg.innerHTML = `
        <p class="center-text">You have not taken any ${level} tests yet.</p>
        <p class="center-text">Please take a test to appear on the leaderboard.</p>
      `;
      return;
    }
  })


  db.collection('Leaderboard').where("Difficulty", "==", level)
    .orderBy(`HighestScore`, "desc")
    .get()
    .then(snapshot => {
      let rank=1;
      snapshot.forEach(doc => {
        const data = doc.data();
        if(data.TotalTests === 0) return;
        const card = document.createElement("div");
        card.className = "leaderboard-card";
        card.innerHTML = `
          <div><strong>${rank}. ${data.Name}</strong></div>
          <div><strong>${data.HighestScore}</strong></div>
        `;
        board.appendChild(card);
        rank++;
        card.addEventListener("click", () => { BoardPopup(data);});
      });
    })
    .catch(error => {
      console.error("Error loading leaderboard:", error);
      board.innerHTML = `<p class="center-text" style="color:red;">Failed to load leaderboard.</p>`;
    })
}
function selectBoardMode(val, level) {
  document.querySelectorAll(".lvl-option").forEach(option => {
    option.classList.remove("selected-lvl");
  });
  val.classList.add("selected-lvl");

  leaderboardfor(level);
}

function BoardPopup(data) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup-card";
  popup.innerHTML = `
    <h3><strong>${data.Name}</strong></h3>
    <p><strong>Date Joined:</strong> ${new Date(data.Joined?.toDate()).toLocaleString()}</p>
    <p>Total Tests: ${data.TotalTests}</p>
    <p>Highest Accuracy: ${data.HighestAccuracy}%</p>
    <p>Highest WPM: ${data.HighestWPM}</p>
    <p>Highest Score: ${data.HighestScore}</p>
    <p>AvgWPM: ${data.AvgWPM}</p>
    <p>AvgAccuracy: ${data.AvgAccuracy}%</p>
    <p>AvgScore: ${data.AvgScore}</p>
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

function loadcertificate() {
  db.collection("Leaderboard").doc(`${currentUser.email}_Hard`).get()
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
  window.scrollTo(0, 0); // Prevent scroll from adding white space

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
      format: [620, 445],  // match actual certificate size
      orientation: 'landscape'
    }
  };

  html2pdf().set(opt).from(element).save();
}
