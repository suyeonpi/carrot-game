'use strict';

import PopUp from './popup.js';

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const gameField = document.querySelector('.game__field');
const fieldRect = gameField.getBoundingClientRect();

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  startGame();
})

gameBtn.addEventListener('click', ()=> {
  if(started){
    stopGame();
  } else {
    startGame();
  }
})

gameField.addEventListener('click', onFieldClick)


function onFieldClick(event) {
  if(!started) return;
  const target = event.target;
  if(target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound)
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true)
    }
  } else if (target.matches('.bug')) {
    playSound(bugSound)
    finishGame(false);
  }
}

function startGame(){
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound)
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showWithText('REPLAY ❓');
  stopSound(bgSound)
  playSound(alertSound);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  stopGameTimer();
  gameFinishBanner.showWithText(win ? 'YOU WON ❗️' : 'YOU LOST 😰');
  playSound(win ? winSound : bugSound);
  stopSound(bgSound)
}


function stopGameTimer() {
  clearInterval(timer);
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play')
  gameBtn.style.visibility = 'visible';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}


function startGameTimer(){
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(()=> {
    if(remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function initGame() {
  score = 0;
  gameField.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png'); 
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    gameField.appendChild(item);
  }
  
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}



