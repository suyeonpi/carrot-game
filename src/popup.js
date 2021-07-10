'use strict';

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector('.pop-up');
    this.popUpMessage = document.querySelector('.pop-up__message')
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    
    this.popUpRefresh.addEventListener('click', ()=> {
      this.onClick && this.onClick();
      this.hide();
    })
  }
  
    setClickListener(onClick) {
    this.onClick = onClick;
    }

    showWithText(text) {
      this.popUp.classList.remove('pop-up--hide');
      this.popUpMessage.innerText = text;
    }
  
    hide() {
    this.popUp.classList.add('pop-up--hide');
    }
  }