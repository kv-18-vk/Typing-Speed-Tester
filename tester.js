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
const matter = document.getElementById("matter");
const element2 = document.querySelector("#practice-space");
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
  referenceText = "Throughout history, humanity has been driven by an insatiable curiosity, a desire to explore the unknown, to sail beyond the horizon, and to chart territories never before seen. From the ancient voyages of Polynesians navigating by the stars, to the daring expeditions of the Age of Discovery, exploration has always played a vital role in the evolution of civilization.In the 15th century, figures like Vasco da Gama and Christopher Columbus changed the world map forever. They braved treacherous seas and uncertain paths, guided by rudimentary tools and an unshakable belief in something greater beyond the edge of the known world. Their discoveries were both wondrous and controversial, sparking centuries of trade, conflict, and cultural exchange.Fast forward to the 20th century — exploration didn’t stop at Earth. The Space Age brought forth a new frontier, with the launch of Sputnik, the first artificial satellite, in 1957. Just twelve years later, Neil Armstrong stepped onto the Moon and declared, “That’s one small step for man, one giant leap for mankind.” Humanity had gone beyond the planet that birthed it, venturing into the vacuum of space.Today, exploration has evolved in fascinating ways. We no longer rely solely on physical travel. The digital revolution allows us to explore virtually — zooming through satellite maps, diving into underwater ecosystems using remote submersibles, or learning about the past through virtual reality simulations. Information travels faster than ever, and with it, our capacity to understand and appreciate the world grows.Yet, there is still so much to discover. Oceans, which cover more than 70% of our planet, remain largely uncharted. Deep within jungles or beneath the ice of Antarctica, secrets lie hidden. New species, ancient fossils, and even entire ecosystems are still being found every year";
  element.disabled = false;
  endtime = 0;
  initMatter(referenceText,"matter","char");
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

  if (val.innerText.trim() === "Typing Practice") {
    element2.disabled = false;
    element2.value = "";
    correcttyped = 0;
    totaltyped = 0;
    currentStart = 0;
    correctWords = 0;
    referenceText = "hello i am vishnu naveen rodshan siva and we doing project based on our typing speed and accuracy, we are using jaavscript and html,csss.";
    initMatter(referenceText,"practicematter","pchar");
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
  const typed = element2.value;

  colorCharacters(typed,"pchar"); // update colors

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
