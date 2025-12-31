// VARIABILI GENERALI
const body = document.getElementsByTagName("body")[0];
const main = document.getElementsByTagName("MAIN")[0];
const menu = document.getElementById("mainMenu");
const numCards = document.getElementById("numCards");
const colorCards = document.getElementById("styleCards");
const colorCardsSelection = document.querySelectorAll(".style");
const numCardsSelection = document.querySelectorAll(".number");
const startBtn = document.getElementById("startBtn");
const controls = document.getElementById("controls");
const time = document.getElementById("time");
const moves = document.getElementById("moves");
const color = ["blue", "red", "orange", "green", "purple", "pink"];
const colorArray = [];
const cardsPicked = [];
const divArray = [];
const scores = JSON.parse(localStorage.getItem("score")) || [];
let click = 0;
let counterMoves = 0;

//---------------------------------- FUNZIONE PER PRENDERE DELLE FIGURE A CASO
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
//-----------------------------------METTERE LE FIGURE IN UN UNICO ARRAY
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
//-----------------------------------FUNZIONE PER CREARE LE CARTE CON LE FIGURE
const createCards = (n, c) => {
  createColorArray(n);
  for (let i = 0; i < n; i++) {
    const div = document.createElement("div");
    div.classList.add(color[colorArray[i]]);
    div.dataset.color = color[colorArray[i]];
    if (c === "red") div.classList.add("redCard");
    else div.classList.add("blueCard");
    if (n === 24) div.classList.add("card24");
    else div.classList.add("card50");
    main.appendChild(div);
    divArray.push(div);
    div.addEventListener("click", (e) => {
      e.target.classList.toggle("flipped");
      setTimeout(() => {
        if (c === "red") div.classList.remove("redCard");
        else div.classList.remove("blueCard");
      }, 200);
      e.target.classList.add("eventNone");
      cardsPicked.push(e.target);
      click++;
      counterMoves++;
      moves.innerText = `moves: ${counterMoves}`;
      check(c);
    });
  }
};
//---------------------------------FUNZIONE PER CONTROLLARE SE LE CARTE PRESE SONO UGUALI
const check = (c) => {
  if (click === 2) {
    click = 0;
    if (!(cardsPicked[0].dataset.color == cardsPicked[1].dataset.color)) {
      setTimeout(() => {
        cardsPicked[0].classList.toggle("flipped");
        cardsPicked[1].classList.toggle("flipped");
        if (c === "red") {
          cardsPicked[0].classList.add("redCard");
          cardsPicked[1].classList.add("redCard");
        } else {
          cardsPicked[0].classList.add("blueCard");
          cardsPicked[1].classList.add("blueCard");
        }
        divArray.forEach((e) => e.classList.remove("eventNone"));
        cardsPicked.splice(0, 2);
      }, 1000);
    } else {
      setTimeout(() => {
        cardsPicked[0].classList.add("rightSet");
        cardsPicked[1].classList.add("rightSet");
        cardsPicked[0].classList.add("opacity");
        cardsPicked[1].classList.add("opacity");
        cardsPicked.splice(0, 2);
        victoryCheck(c);
      }, 1000);
    }
  }
};
//---------------------------------------LISTENER PER IL MAIN MENU
numCards.addEventListener("click", (e) => {
  if (e.target.classList.contains("number")) {
    numCardsSelection.forEach((e) => e.classList.remove("borderSelected"));
    e.target.classList.add("borderSelected");
  }
});
colorCards.addEventListener("click", (e) => {
  if (e.target.classList.contains("style")) {
    colorCardsSelection.forEach((e) => e.classList.remove("borderSelected"));
    e.target.classList.add("borderSelected");
  }
});

startBtn.addEventListener("click", () => {
  controls.classList.remove("hide");
  body.classList.add("bodyBcgInGame");
  const numberSelected = [];
  numCardsSelection.forEach((e) => {
    if (e.classList.contains("borderSelected")) numberSelected.push(parseInt(e.innerText));
  });
  const colorSelected = [];
  colorCardsSelection.forEach((e) => {
    if (e.classList.contains("borderSelected")) colorSelected.push(e);
  });
  let colorOfCards = "red";
  if (colorSelected[0].classList.contains("redCard")) colorOfCards = "red";
  else colorOfCards = "blue";
  menu.style.display = "none";
  createCards(numberSelected[0], colorOfCards);
  timer();
});
//---------------------------------- FUNZIONE PER IL CHECK DELLA VITTORIA
const victoryCheck = (c) => {
  if (c === "red") {
    if (divArray.every((e) => !e.classList.contains("redCard"))) {
      setTimeout(() => {
        divArray.forEach((e) => e.classList.add("hide"));
      }, 500);
      setTimeout(() => {
        controls.classList.add("hide");
        const h1 = document.createElement("h1");
        const btn = document.createElement("button");
        btn.innerText = "NUOVA PARTITA";
        btn.classList.add("startbtn");
        btn.classList.add("startbtn:hover");
        btn.addEventListener("click", () => {
          window.location.reload();
        });
        h1.innerText = `HAI VINTO IN ${counterMoves} MOSSE E CON UN TEMPO DI ${minutes}:${seconds}`;
        const div = document.createElement("div");
        div.classList.add("divFinal");
        h1.classList.add("victoryScreen");
        main.appendChild(div);
        div.appendChild(h1);

        // data saver function and storage-------------------------------
        scores.push({
          moves: counterMoves,
          time: `${minutes}:${seconds}`,
          date: new Date().toLocaleString(),
        });
        localStorage.setItem("score", JSON.stringify(scores));
        let finalscore = JSON.parse(localStorage.getItem("score"));
        const ul = document.createElement("ul");
        ul.classList.add("ulBcg");
        for (let i = 0; i < finalscore.length; i++) {
          let moves = finalscore[i].moves;
          let time = finalscore[i].time;
          let date = finalscore[i].date;
          const li = document.createElement("li");
          li.innerText = `${date} - punteggio di ${moves} in ${time}`;
          li.classList.add("scoreScreen");
          ul.appendChild(li);
        }
        div.appendChild(ul);
        div.appendChild(btn);
      }, 500);
    }
  } else {
    if (divArray.every((e) => !e.classList.contains("blueCard"))) {
      setTimeout(() => {
        divArray.forEach((e) => e.classList.add("hide"));
      }, 500);
      setTimeout(() => {
        controls.classList.add("hide");
        const h1 = document.createElement("h1");
        const btn = document.createElement("button");
        btn.innerText = "NUOVA PARTITA";
        btn.classList.add("startbtn");
        btn.classList.add("startbtn:hover");
        btn.addEventListener("click", () => {
          window.location.reload();
        });
        h1.innerText = `HAI VINTO IN ${counterMoves} MOSSE E CON UN TEMPO DI ${minutes}:${seconds}`;
        const div = document.createElement("div");
        div.classList.add("divFinal");
        h1.classList.add("victoryScreen");
        main.appendChild(div);
        div.appendChild(h1);

        // data saver function and storage-------------------------------
        scores.push({
          moves: counterMoves,
          time: `${minutes}:${seconds}`,
          date: new Date().toLocaleString(),
        });
        localStorage.setItem("score", JSON.stringify(scores));
        let finalscore = JSON.parse(localStorage.getItem("score"));
        const ul = document.createElement("ul");
        ul.classList.add("ulBcg");
        for (let i = 0; i < finalscore.length; i++) {
          let moves = finalscore[i].moves;
          let time = finalscore[i].time;
          let date = finalscore[i].date;
          const li = document.createElement("li");
          li.innerText = `${date} - punteggio di ${moves} in ${time}`;
          li.classList.add("scoreScreen");
          ul.appendChild(li);
        }
        div.appendChild(ul);
        div.appendChild(btn);
      }, 500);
    }
  }
};
// timer function ---------------------------------------
let seconds = 0;
let minutes = 0;
const timer = () => {
  setInterval(() => {
    if (seconds === 59) {
      seconds = 0;
      minutes++;
    }
    if (seconds < 9) {
      seconds++;
      time.innerText = ` ${minutes}:0${seconds}`;
    } else {
      seconds++;
      time.innerText = ` ${minutes}:${seconds}`;
    }
  }, 1000);
};
