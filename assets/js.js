const main = document.getElementsByTagName("MAIN")[0];
const menu = document.getElementById("mainMenu");
const numCards = document.getElementById("numCards");
const numCardsSelection = document.querySelectorAll(".number");
const startBtn = document.getElementById("startBtn");
const color = ["blue", "red", "orange", "green", "purple", "pink"];
const colorArray = [];
const cardsPicked = [];
const divArray = [];
let click = 0;

//------------------------------------------------------
const shuffleColor = (n) => {
  let usedNumber = [];
  for (let i = 0; i < n; i++) {
    let num = Math.floor(Math.random() * n);
    while (usedNumber.some((e) => e === num)) {
      num = Math.floor(Math.random() * n);
    }
    usedNumber.push(num);
  }
  return usedNumber;
};
//------------------------------------------------------
const createColorArray = (n) => {
  if (n === 50) {
    for (let i = 0; i < 9; i++) {
      colorArray.push(...shuffleColor(6));
    }
  } else {
    for (let i = 0; i < 6; i++) {
      colorArray.push(...shuffleColor(4));
    }
  }
};
//------------------------------------------------------
const createCards = (n) => {
  createColorArray(n);
  for (let i = 0; i < n; i++) {
    const div = document.createElement("div");
    div.classList.add(color[colorArray[i]]);
    div.dataset.color = color[colorArray[i]];
    div.classList.add("white");
    if (n === 24) div.classList.add("card24");
    else div.classList.add("card50");
    main.appendChild(div);
    divArray.push(div);
    div.addEventListener("click", (e) => {
      e.target.classList.toggle("flipped");
      const test = setInterval(() => {
        console.log(e.target);
        e.target.classList.remove("white");
        clearInterval(test);
      }, 200);
      e.target.classList.add("eventNone");
      cardsPicked.push(e.target);
      click++;
      check();
    });
  }
};
//------------------------------------------------------
const check = () => {
  if (click === 2) {
    click = 0;
    if (!(cardsPicked[0].dataset.color == cardsPicked[1].dataset.color)) {
      setTimeout(() => {
        cardsPicked[0].classList.add("white");
        cardsPicked[1].classList.add("white");
        divArray.forEach((e) => e.classList.remove("eventNone"));
        cardsPicked.splice(0, 2);
      }, 500);
    } else {
      setTimeout(() => {
        cardsPicked[0].classList.add("rightSet");
        cardsPicked[1].classList.add("rightSet");
        cardsPicked[0].classList.add("opacity");
        cardsPicked[1].classList.add("opacity");
        cardsPicked.splice(0, 2);
        victoryCheck();
      }, 500);
    }
  }
};
//------------------------------------------------------
numCards.addEventListener("click", (e) => {
  if (e.target.classList.contains("number")) {
    numCardsSelection.forEach((e) => e.classList.remove("borderSelected"));
    e.target.classList.add("borderSelected");
  }
});

startBtn.addEventListener("click", () => {
  const numberSelected = [];
  numCardsSelection.forEach((e) => {
    if (e.classList.contains("borderSelected")) numberSelected.push(parseInt(e.innerText));
  });
  menu.style.display = "none";
  createCards(numberSelected[0]);
});
const victoryCheck = () => {
  if (divArray.every((e) => !e.classList.contains("white"))) {
    const victoryTime = setInterval(() => {
      divArray.forEach((e) => e.classList.add("hide"));
      clearInterval(victoryTime);
    }, 500);
    const victoryTitle = setInterval(() => {
      const h1 = document.createElement("h1");
      h1.innerText = "HAI VINTO";
      main.appendChild(h1);
      clearInterval(victoryTitle);
    }, 500);
  }
};
