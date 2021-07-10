'use strict';

import PopUp from './popup.js';
import Game from './game.js';


const gameFinishBanner = new PopUp();

const game = new Game(3, 2, 2);
game.setGameStopListener((reason) => {
  let message;
  switch(reason) {
    case 'cancel':
      message = 'REPLAY ❓'
      break;
    case 'win':
      message = 'YOU WON ❗️'
      break;
    case 'lose':
      message = 'YOU LOST 😰'
      break;
  }
  gameFinishBanner.showWithText(message);
})

gameFinishBanner.setClickListener(() => {
  game.start();
})