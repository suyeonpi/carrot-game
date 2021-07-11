'use strict';

import { Field, ItemType } from './field.js';
import * as sound  from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export class GameBuilder {
  withGameDuraiton(duration) {
    this.gameDuration = duration;
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    console.log(this);
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}
export class Game {
  constructor(gameDuration, carrotCount, bugCount){
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameBtn = document.querySelector('.game__button');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn.addEventListener('click',() => {
      if(this.started){
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
    
    this.started = false;
    this.score = 0;
    this.timer = undefined;

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);
  }


  onItemClick = item => {
    if(!this.started) return;
  
    if(item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win)
      }
    } else if (item === ItemType.bug) {
      sound.playBug();
      this.stop(Reason.lose);
    }
  }

  init() {
    this.score = 0;
    this.gameField.init();
    this.gameScore.innerText = this.carrotCount;
  }

  start() {
    this.started = true;
    this.init();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }
  
  startGameTimer() {
    let remainingTimeSec = this.gameDuration
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(()=> {
      if(remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }
  
  updateScoreBoard() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
  
  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }


}