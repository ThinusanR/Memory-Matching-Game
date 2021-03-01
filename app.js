//game setup
function intializeGame(size = 4) {
  const resetBtn = document.querySelector("#reset-nav");
  createCardClass(size);
  gameStart(size);
  gameDifficultySelection();
  resetBtn.addEventListener("click", () => {
    reset(size);
  });
}
//handles the game difficulty settings when clicked
function gameDifficultySelection() {
  const difficultyBtn = document.querySelectorAll(".difficulty");
  const gameContainer = document.querySelector("#game-container");
  let boardValue = 0;
  let userSelection = 0;
  for (let i = 0; i < difficultyBtn.length; i++) {
    difficultyBtn[i].addEventListener("click", function () {
      if (difficultyBtn[userSelection].classList.contains("selected")) {
        difficultyBtn[userSelection].classList.remove("selected");
        difficultyBtn[i].classList.toggle("selected");
        userSelection = i;
      }

      if (difficultyBtn[i].id === "medium") {
        boardValue = parseInt(difficultyBtn[i].value);
        reset(boardValue);
      } else if (difficultyBtn[i].id === "hard") {
        boardValue = parseInt(difficultyBtn[i].value);
        reset(boardValue);
      } else {
        boardValue = parseInt(difficultyBtn[i].value);
        reset(boardValue);
      }
    });
  }
}
//reset the gameboard, timer, # of moves
function reset(size) {
  const gameContainer = document.querySelector("#game-container");
  document.querySelector("#min").innerText = "00";
  document.querySelector("#sec").innerText = "00";
  document.querySelector("#moves").innerText = "0";
  let cardBackSide = document.querySelectorAll(".card-num");
  clearInterval(timer.interval);
  while (gameContainer.firstChild) {
    gameContainer.firstChild.remove();
  }
  intializeGame(size);
}
//initiates a timer and updates it to the screen
function timer() {
  let minutes = 0;
  let seconds = 0;

  timer.interval = setInterval(() => {
    seconds < 10
      ? (document.querySelector("#sec").innerText = `0${seconds}`)
      : (document.querySelector("#sec").innerText = seconds);

    if (seconds > 60) {
      minutes++;
      seconds = 0;
      if (minutes < 10) {
        document.querySelector("#min").innerText = `0${minutes}`;
        document.querySelector("#sec").innerText = `0${seconds}`;
      } else {
        document.querySelector("#min").innerText = minutes;
        document.querySelector("#sec").innerText = `0${seconds}`;
      }
    }

    seconds++;
  }, 1000);
}

function gameStart(size) {
  const gameBoard = makeGameboard(size);
  let cardActive = false;
  let gameOver = false;
  let gameStart = true;
  let firstCard,
    secondCard = "";
  let matchs = 0;
  let moves = 0;
  const cards = document.querySelectorAll(".card-inner");
  let cardBackSide = document.querySelectorAll(".card-num");
  let cardBack = document.querySelectorAll(".card-back");
  const numOfMoves = document.querySelector("#moves");
  const min = document.querySelector("#min");
  const sec = document.querySelector("#sec");
  const winningMessageElement = document.querySelector("#winningMessage");
  const resetBtn = document.querySelector("#reset-final");

  for (let i = 0; i < size * size; i++) {
    if (!gameOver) {
      cards[i].addEventListener("click", function () {
        if (gameStart) {
          timer();
          gameStart = false;
        }
        if (!cardActive && !firstCard) {
          firstCard = i;
          let [row, col] = positionLookUp(firstCard, size, size);
          cardBackSide[firstCard].innerText = gameBoard[row][col];
          cardActive = true;
          cards[firstCard].classList.toggle("is-flipped");
        
        } else if (cardActive && firstCard !== "" && secondCard === "") {
          secondCard = i;

          let [row, col] = positionLookUp(i, size, size);
          cardBackSide[secondCard].innerText = gameBoard[row][col];
          cards[secondCard].classList.toggle("is-flipped");

          let matchCheck = setTimeout(function () {
            if (
              cardBackSide[firstCard].innerText ===
              cardBackSide[secondCard].innerText
            ) {
              cardBack[firstCard].classList.toggle("match");
              cardBack[secondCard].classList.toggle("match");

              setTimeout(function () {
                cardBack[firstCard].classList.remove("match");
                cardBack[secondCard].classList.remove("match");
                secondCard = "";
                firstCard = "";
              }, 400);

              cardActive = false;
              matchs += 1;
              moves += 1;
              numOfMoves.innerText = moves;
              if (matchs === (size * size) / 2) {
                gameOver = true;
                clearInterval(timer.interval);
                winningMessageElement.classList.add("show");
                document.querySelector("#moves-final").innerText =
                  numOfMoves.innerText;
                document.querySelector("#min-final").innerText = min.innerText;
                document.querySelector("#sec-final").innerText = sec.innerText;
                resetBtn.addEventListener("click", () => {
                  winningMessageElement.classList.remove("show");
                  reset(size);
                });
              }
            } else {
              moves += 1;
              numOfMoves.innerText = moves;
              cardBack[firstCard].classList.toggle("no-match");
              cardBack[secondCard].classList.toggle("no-match");

              cards[secondCard].classList.remove("is-flipped");
              cards[firstCard].classList.remove("is-flipped");
              setTimeout(function () {
                cardBack[firstCard].classList.remove("no-match");
                cardBack[secondCard].classList.remove("no-match");

                secondCard = "";
                firstCard = "";
              }, 50);
              cardBackSide[firstCard].innerText = "";
              cardBackSide[secondCard].innerText = "";
              cardActive = false;
            }
          }, 600);
        }
      });
    }
  }
}

//lookup a position in a 2d array using the index of 1d array
function positionLookUp(index, cols, rows) {
  for (let i = 0; i < rows; i++) {
    //check if the index parameter is in the row
    if (index < cols * i + cols && index >= cols * i) {
      //return x, y
      return [i, index - cols * i];
    }
  }
}
//create the card deck and added it into the html
function createCardClass(size) {
  const gameContainer = document.querySelector("#game-container");

  for (let i = 0; i < size * size; i++) {
    const card = document.createElement("div");
    const cardInner = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const numText = document.createElement("span");
    card.className = "card";
    cardInner.className = "card-inner";
    cardFront.className = "card-front";
    cardBack.className = "card-back";
    numText.className = "card-num";

    gameContainer.appendChild(card);
    card.appendChild(cardInner);
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardBack.appendChild(numText);
  }
  if (size === 4) {
    //removes any class and adds in the new class style
    gameContainer.removeAttribute("class");
    gameContainer.classList.toggle("easy");
  } else if (size === 6) {
    gameContainer.removeAttribute("class");
    gameContainer.classList.toggle("medium");
  } else {
    gameContainer.removeAttribute("class");
    gameContainer.classList.toggle("hard");
  }
}

//creates a 2d array filled with duplicate shuffled numbers
function makeGameboard(boardSize) {
  const items = [];
  for (let i = 1; i <= (boardSize * boardSize) / 2; i++) {
    //initalize the numbers
    items.push(i);
    items.push(i);
  }
  const shuffledItems = shuffleCards(items);
  const board = [];
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = shuffledItems.splice(0, 1); //add shuffled nums into board and delete the num after adding it in
    }
  }
  return board;
}
function shuffleCards(arr) {
  //fisher-yates algorithm
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}
intializeGame();
