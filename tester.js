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

function updateTimerDisplay() {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timer").textContent =`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function SUBMIT() {
  fillpage.classList.add("hide");
  testpage.classList.remove("hide");

  let difficulty = document.getElementById("difficulty").value;
  let time = parseInt(document.getElementById("time").value); 
  seconds = time * 60; 
  updateTimerDisplay();
  document.getElementById("modedisplay").innerText = difficulty;
  matter.innerText = "hello i am vishnu , i am very good boy";
  element.value = "";
  correcttyped = 0;
  totaltyped = 0;
  element.disabled = false;
  endtime = 0;
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

  const timerEl = document.getElementById("timer");
  timerEl.textContent = "Time Up";
  Accuracy = (correcttyped/totaltyped)*100;
  timerEl.classList.add("blink");

  // After 2 seconds, stop blinking
  setTimeout(() => {
    timerEl.classList.remove("blink");
    timerEl.innerText = `Accuracy : ${Accuracy.toFixed(2)} %`;
  }, 2000);
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



function comparetext() {
    let referencetext = matter.innerText;
    let inputtext = element.value;
    let newtext = "";
    correcttyped = 0;
    for (let i = 0; i<referencetext.length;i++){
        if (i<inputtext.length){
            if (inputtext[i] === referencetext[i]){
                newtext += `<span class="correct-char">${referencetext[i]}</span>`;
                correcttyped++;
            } else {
                newtext += `<span class="wrong-char">${referencetext[i]}</span>`;
            }
        } else {
            newtext += `<span>${referencetext[i]}</span>`;
        }
    }
    matter.innerHTML = newtext;
    if(inputtext.length===referencetext.length){
      stop()
    }
}



element.addEventListener("input", function(){
    startTimer();
    comparetext();
})
element.addEventListener("keydown", function (event) {
    if (event.key.length === 1 || event.key === " ") {
        totaltyped++;
    } 
    if (event.key === "Enter"){
        event.preventDefault();
    }
});
