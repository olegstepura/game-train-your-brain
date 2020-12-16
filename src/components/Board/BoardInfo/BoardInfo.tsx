import { Colors, Positions, WithOnClick } from 'store/types';
import './BoardInfo.css';
import React from 'react';
import { completeLineText, linesAmount, randomColorsText } from 'config';

const BoardInfo = (props: WithOnClick) => {
  return (
    <div className="BoardInfo" onClick={props.onClick}>
      <h1>How to play:</h1>
      <p>
        Computer creates a hidden sequence of {Positions.length} random unique colors.
        Each hidden color is a color of {Colors.length} possible variants.
        Those colors are hidden in top row. You need to guess each color and it's position
        using {linesAmount} attempts. You start from bottom line.
      </p>
      <p>
        In the beginning you can use {randomColorsText} button to let computer randomly select colors for you.
      </p>
      <p>
        On each line you need to click a circle and select a color to be placed in each circle
        using a color selector that will appear after click.
      </p>
      <p>
        If a line can be submitted a {completeLineText} button will appear.
        Once you are sure you can click this button to check the results.
        Once results are submitted you will see a score in the same line.
        Score will have black and white dots.
        Each black dot indicates that one color matched both hidden color and position,
        each white dot indicates that only color matched.
      </p>
      <p>
        You can restart game by clicking hidden area on top.
      </p>
      <p>
        Click to close this info and go back to game.
      </p>
    </div>
  )
}

export default BoardInfo;