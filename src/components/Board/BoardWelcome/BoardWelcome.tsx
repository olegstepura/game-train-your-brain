import { WithOnClick } from 'store/types';
import './BoardWelcome.css';
import React from 'react';

const BoardWelcome = (props: WithOnClick) => {
  return (
    <div className="Board BoardWelcome" onClick={props.onClick}>
      <img src="logo.png" alt="App logo" className="logo" />
      <span className="Board__Msg">Click to start</span>
      <div className="BoardWelcome__Credentials">
        <a href="https://github.com/olegstepura/game-train-your-brain" target="brain-github">
          Weekend React.js project by Oleg Stepura
        </a>
        <br />
        Logo designed by Anastasiya Stepura
      </div>
    </div>
  )
}

export default BoardWelcome;