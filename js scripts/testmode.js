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
        renderAccuracyChart(Accuracy,"accuracyChart");
        displayerrors(wrongwords,"wrongwords-list","wrongwords-box","titlediv");
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
        renderAccuracyChart(Accuracy,"accuracyChart");
        displayerrors(wrongwords,"wrongwords-list","wrongwords-box","titlediv");
        document.getElementById("scoreheader").innerHTML = `<strong>Your Score: </strong>${score}`;
        document.getElementById("testresults").innerHTML = `
          ⏰ Time: ${parseFloat(finishedtime.toFixed(2))} min<br><br><br>
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
    <button id="start-test">OK</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  popup.classList.add("popup-show");
  overlay.classList.add("popup-fade");

  overlay.addEventListener("click", (e) => {
    if (e.target === document.getElementById("start-test")) {
      overlay.remove();
    }
  });
}