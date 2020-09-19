import React from 'react';

function CurrentQuestion(props) {
    return (
      <div id="questionBox">
          Now I would like to eat...
          <div id="question">{props.currentlySearched.question}</div>
          Remember that all other<br></br>phonemes poison me!
      </div>
    );
  }
  
  export default CurrentQuestion;