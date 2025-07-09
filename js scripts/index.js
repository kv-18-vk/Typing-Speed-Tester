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

// Track current user
auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    console.log("User signed in:", user.email);
  } else {
    console.log("No user signed in.");
  }
});

document.querySelector(".btn").addEventListener("click",()=>{
  document.getElementById("homepage").classList.add("hide");
  document.getElementById("logform").classList.remove("hide");
})

let loginPage = document.querySelector(".login-form");
let registerPage = document.querySelector(".register-form");

document.querySelector(".register").addEventListener("click", function () {
  const name = document.querySelector("#regName").value;
  const email = document.querySelector("#regUsername").value;
  const password = document.querySelector("#regPassword").value;
  const confirmPassword = document.querySelector("#regConfirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all the details.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  auth.createUserWithEmailAndPassword(email,password)
   .then((userCredential) => {
      const user=userCredential.user

      db.collection("users").doc(user.uid).set({
        email : user.email,
        name: name,
        TotalEasyTests: 0,
        TotalMediumTests: 0,
        TotalHardTests: 0,
        unlockedIndex: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      db.collection("Multiplayer").doc(user.uid).set({
        TotalGames:0,
        EXP:0,
        Name:name
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
        db.collection(`users/${user.uid}/${diff} tests`).doc("stats").set(Data);
        db.collection('Leaderboard').doc(`${user.uid}_${diff}`).set({
          Name: name,
          Email: user.email,
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
      document.querySelector("#regName").value = "";
      document.querySelector("#regUsername").value = "";
      document.querySelector("#regPassword").value = "";
      document.querySelector("#regConfirmPassword").value = "";
      registerPage.classList.add("hide");
      loginPage.classList.remove("hide");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    })
});

document.querySelector(".login").addEventListener("click", function () {
  const email = document.querySelector("#loginUsername").value.trim();
  const password = document.querySelector("#loginPassword").value;

  if (!email || !password) {
    alert("Please enter the details.");
    return;
  }

 auth. signInWithEmailAndPassword( email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.replace("app.html");
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

document.querySelectorAll(".toggle-password").forEach((toggleIcon) => {
  toggleIcon.addEventListener("click", () => {
    const inputSelector = toggleIcon.getAttribute("toggle");
    const input = document.querySelector(inputSelector);

    if (input.type === "password") {
      input.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  });
});