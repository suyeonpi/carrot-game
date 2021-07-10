'use strict';

import PopUp from './popup.js';
import Field from './field.js';
import * as sound  from './sound.js';

const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  startGame();
})

const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gameField.setClickListener(onItemClick);

function onItemClick(item) {
  if(!started) return;

  if(item === 'carrot') {
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true)
    }
  } else if (item === 'bug') {
    sound.playBug();
    finishGame(false);
  }
}
gameBtn.addEventListener('click', ()=> {
  if(started){
    stopGame();
  } else {
    startGame();
  }
})

function startGame(){
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  sound.playBackground();
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  gameFinishBanner.showWithText('REPLAY ❓');
  sound.stopBackground();
  sound.playAlert();
}

function finishGame(win) {
  started = false;
  hideGameButton();
  if(win) {
    sound.playWin();
  } else {
    sound.playBug();
  }
  stopGameTimer();
  gameFinishBanner.showWithText(win ? 'YOU WON ❗️' : 'YOU LOST 😰');
  sound.stopBackground();
}


function stopGameTimer() {
  clearInterval(timer);
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
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
  gameScore.innerText = CARROT_COUNT;
  gameField.init();
}
