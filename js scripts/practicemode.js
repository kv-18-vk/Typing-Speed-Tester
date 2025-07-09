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
    else{
      wrongwords.push([refWords[i],typedWords[i]]);
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
    displayerrors(wrongwords,"p-wrongwords-list","p-wrongwords-box","ptitlediv");
    renderAccuracyChart(Accuracy,"p-accuracyChart");
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
    wrongwords=[];
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