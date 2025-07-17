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
    ],
    link: "https://youtu.be/gfFHkqJZ7so?si=CcIA5TAZEhoYfDKb"
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
    ],
    link: "https://youtu.be/8_aktb9kWzY?si=fik2LvjBW5AV4nEr"
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
    ],
    link:"https://youtu.be/n72Cb0m1lto?si=S1Gdvg-0rtwycbGl"
  },
  lesson4: {
    title: "Lesson IV - Capital Letters",
    exercises: [
      { id: "exercise4-1", name: "Exercise 4.1", desc: "Begin typing uppercase letters with your right hand using the left Shift key." },
      { id: "exercise4-2", name: "Exercise 4.2", desc: "Practice capitalizing left-hand letters using the right Shift key." },
      { id: "exercise4-3", name: "Exercise 4.3", desc: "Now switch between both Shift keys to type capital letters on both sides." }
    ],
    link:"https://youtu.be/F_o1OAAtmyo?si=taUbBo1V2P9q25R_"
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
    ],
    link: "https://youtu.be/ysgmtZWx_DQ?si=aHhU9Pw-tWkY_q2z"
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
    ],
    link :"https://youtu.be/DxYq6H_xgYU?si=i3QRWDxofs9jhPBw"
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
    ],
    link :"https://youtu.be/DxYq6H_xgYU?si=i3QRWDxofs9jhPBw"
  }
};
const indexToExerciseId = {
  0: "exercise1-1",
  1: "exercise1-2",
  2: "exercise1-3",
  3: "exercise1-4",
  4: "exercise1-5",
  5: "exercise1-6",
  6: "exercise1-7",
  7: "exercise1-8",
  8: "exercise1-9",
  9: "exercise1-10",

  10: "exercise2-1",
  11: "exercise2-2",
  12: "exercise2-3",
  13: "exercise2-4",
  14: "exercise2-5",
  15: "exercise2-6",
  16: "exercise2-7",
  17: "exercise2-8",
  18: "exercise2-9",
  19: "exercise2-10",
  20: "exercise2-11",
  21: "exercise2-12",

  22: "exercise3-1",
  23: "exercise3-2",
  24: "exercise3-3",
  25: "exercise3-4",
  26: "exercise3-5",
  27: "exercise3-6",
  28: "exercise3-7",
  29: "exercise3-8",
  30: "exercise3-9",
  31: "exercise3-10",
  32: "exercise3-11",

  33: "exercise4-1",
  34: "exercise4-2",
  35: "exercise4-3",

  36: "exercise5-1",
  37: "exercise5-2",
  38: "exercise5-3",
  39: "exercise5-4",
  40: "exercise5-5",
  41: "exercise5-6",
  42: "exercise5-7",

  43: "exercise6-1",
  44: "exercise6-2",
  45: "exercise6-3",
  46: "exercise6-4",
  47: "exercise6-5",
  48: "exercise6-6",

  49: "exercise7-1",
  50: "exercise7-2",
  51: "exercise7-3",
  52: "exercise7-4",
  53: "exercise7-5",
  54: "exercise7-6"
};

const lessonSelect = document.getElementById('lesson-select');
const exerciseContainer = document.getElementById('exercise-section');
const lessonTitle = document.getElementById('lesson-title');
const link = document.getElementById('link');

function loadExercises(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return;

    lessonTitle.textContent = lesson.title;
    link.href = lesson.link;
    exerciseContainer.innerHTML = ''; 

    lesson.exercises.forEach(ex => {
        const button = document.createElement('button');
        button.id = ex.id;
        button.textContent = ex.name;
        
        const desc = document.createElement('p');
        desc.textContent = ex.desc;

        const exIndex = Object.values(indexToExerciseId).indexOf(ex.id);
        if (exIndex > unlockedIndex) {
          button.disabled = true;
          button.style.background = "grey";
          button.textContent += " 🔒";
          button.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'lesson-tooltip';
            tooltip.innerText = 'Requires 10 WPM and 60% accuracy in previous exercise to unlock';
            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - 30}px`;
            tooltip.style.left = `${rect.left + rect.width*2}px`;
          });
          button.addEventListener('mouseleave', () => {
            document.querySelectorAll('.lesson-tooltip').forEach(t => t.remove());
          })
        }
        
        exerciseContainer.appendChild(button);
        exerciseContainer.appendChild(desc);
        exerciseContainer.appendChild(document.createElement('br'));
    });
}

lessonSelect.addEventListener('change', function() {
    loadExercises(lessonSelect.value);
});

let buttonId;
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
        wrongwords=[];
        lessonbreakbtn.classList.add("hide");
        updateTimerDisplay("lessonstopclock",practiceSeconds);
        buttonId = e.target.id;
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
    }else{wrongwords.push([refWords[i],typedWords[i]]);}
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
    displayerrors(wrongwords,"l-wrongwords-list","l-wrongwords-box","ltitlediv");
    renderAccuracyChart(Accuracy,"l-accuracyChart");
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
    if (wpm >= 10 && Accuracy >= 60) {
    const currentIndex = Object.values(indexToExerciseId).indexOf(buttonId);
    
    if (currentIndex === unlockedIndex) {
      unlockedIndex++;
      db.collection("users").doc(currentUser.uid)
        .update({ unlockedIndex: unlockedIndex })
        .then(() => {
          alert("🎉 Next exercise unlocked!");
        });
    }
  }
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
  loadExercises("lesson1");
}