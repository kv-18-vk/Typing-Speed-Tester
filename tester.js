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

  localStorage.setItem(username, password);
  alert("Registration successful! Please login.");
  registerPage.classList.add("hide");
  loginPage.classList.remove("hide");
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

  const storedPassword = localStorage.getItem(username);

  if (storedPassword === password) {
    localStorage.setItem("currentUser", username);
    bodychange("url(blue.jpg)")
    document.querySelector(".container").classList.add("hide");
    document.querySelector(".flex").classList.remove("hide");
  } else {
    alert("Your details do not match.");
  }
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
  document.querySelector(".container").classList.remove("hide");
  document.querySelector(".flex").classList.add("hide");
  document.querySelector("#loginUsername").value ="";
  document.querySelector("#loginPassword").value ="";
  bodychange("url(typing.jpg")
})








const fillpage = document.querySelector(".fillpage");
const testpage = document.querySelector(".testpage");
const element = document.getElementById("typing-space");
let matter = document.getElementById("matter")
let seconds=0;
let interval = null;
let endtime = 0;
let correcttyped;
let totaltyped;
let Accuracy;
let wpm;
let score;
let time;
const changesize = 20;
const windowSize = 165;
const stepSize = 1;
let currentStart;
let referenceText;
let correctWords;

function updateTimerDisplay() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timer").textContent =`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function SUBMIT() {
  fillpage.classList.add("hide");
  testpage.classList.remove("hide");
  let difficulty = document.getElementById("difficulty").value;
  time = parseInt(document.getElementById("time").value); 
  seconds = time * 60; 
  updateTimerDisplay();
  document.getElementById("modedisplay").innerText = difficulty;
  element.value = "";
  correcttyped = 0;
  totaltyped = 0;
  currentStart = 0;
  correctWords = 0;
  referenceText = "hello i am vieck c check check check check check check check check checkvv";
  element.disabled = false;
  endtime = 0;
  initMatter(referenceText);
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
}

function startTimer() {
  if (interval || seconds <= 0) return;

  interval = setInterval(() => {
    seconds--;
    updateTimerDisplay();

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
  Accuracy = ((correcttyped/totaltyped)*100).toFixed(2);
  wpm = Math.floor(correctWords/time);
  score = wpm*Accuracy

  const timerEl = document.getElementById("timer");
  timerEl.textContent = "TimeUp";
  timerEl.classList.add("blink");

  setTimeout(() => {
    timerEl.classList.remove("blink");
    timerEl.textContent = `Accuracy : ${Accuracy} %  ,  WPM : ${wpm}  , Score : ${score}`;
  }, 2000);
}
function finish() {
    if (interval) {
    clearInterval(interval);
    interval = null;
  }
  endtime = seconds;
  element.disabled = true;
  Accuracy = ((correcttyped/totaltyped)*100).toFixed(2);
  let finishedtime = time - (endtime/60);
  wpm = Math.floor(correctWords/finishedtime);
  score = wpm*Accuracy

  const timerEl = document.getElementById("timer");
  timerEl.textContent = "Finished";
  timerEl.classList.add("blink");

  setTimeout(() => {
    timerEl.classList.remove("blink");
    timerEl.textContent = `Accuracy : ${Accuracy} %  ,  WPM : ${wpm} ,  Score : ${score}`;
  }, 2000);
}
function timeup() {
    
}

// Initial display
updateTimerDisplay();


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
  let page = document.getElementById(val.innerText.trim())
  page.classList.remove("hide")
  val.classList.add("selectedmode")
}


// keyboard event --- timer 




function initMatter(val) {
  let html = "";
  for (let i = 0; i < val.length; i++) {
    html += `<span class=" ${i >= windowSize ? 'hide-char' : ''}" id="char-${i}">${val[i]}</span>`;
  }
  document.getElementById("matter").innerHTML = html;
}

function updateWindowForward() {
  for (let i = currentStart; i < currentStart + stepSize; i++) {
    const charEl = document.getElementById(`char-${i}`);
    if (charEl) charEl.classList.add("hide-char");
  }
  for (let i = currentStart + windowSize; i < currentStart + windowSize + stepSize; i++) {
    const charEl = document.getElementById(`char-${i}`);
    if (charEl) charEl.classList.remove("hide-char");
  }
  currentStart += stepSize;
}

function updateWindowBackward() {
  for (let i = currentStart + windowSize - stepSize; i < currentStart + windowSize; i++) {
    const charEl = document.getElementById(`char-${i}`);
    if (charEl) charEl.classList.add("hide-char");
  }
  for (let i = currentStart - stepSize; i < currentStart; i++) {
    const charEl = document.getElementById(`char-${i}`);
    if (charEl) charEl.classList.remove("hide-char");
  }
  currentStart -= stepSize;
}




function colorCharacters(userInput) {
  correcttyped = 0;
  for (let i = 0; i < referenceText.length; i++) {
    let expected = referenceText[i];
    let typed = userInput[i];
    let charSpan = document.getElementById(`char-${i}`);

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

  colorCharacters(typed); // update colors

  if (typed.length >= referenceText.length) {
    finish();
  }
  if (typed.length >= currentStart + changesize) {
    updateWindowForward(); // update visible range
  } else if (typed.length < currentStart+changesize && currentStart > 0) {
    updateWindowBackward();
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
