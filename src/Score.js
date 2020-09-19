import React from 'react';

function Score(props) {
  return (
    <div id="score">
      Current score:<br></br>
      <span>{props.score}</span>
    </div>
  );
}

export default Score;