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
  matter.innerText = difficulty;
  element.value = "";
  element.disabled = true;
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
  element.disabled = false;

  interval = setInterval(() => {
    seconds--;
    updateTimerDisplay();

    if (seconds <= 0) {
      STOP();
      alert("Time's up!");
    }
  }, 1000);
}

function STOP() {
  element.disabled = true;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  endtime = seconds;
  updateTimerDisplay();
}

// Initial display
updateTimerDisplay();


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
