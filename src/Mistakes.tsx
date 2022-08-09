// @ts-nocheck
import * as React from 'react';
import { phonemes } from './RP_segments_API';

export const getCorrectAnswers = (mistakes_arr) => {
  let mistakes = [];
  for (let i = 0; i < mistakes_arr.length; i++) {
    let mistake = [];
    mistake.push(mistakes_arr[i][1]["question"]);
    mistake.push(mistakes_arr[i][0]["ipa"]);
    let correct_answers = []
    for (let j = 0; j < phonemes.length; j++) {
      for (let prop in phonemes[j]) {
        if (mistakes_arr[i][1]["classes"].includes(phonemes[j][prop])) {
          correct_answers.push(phonemes[j]["ipa"]);
        }
      }
    }
    correct_answers = [...new Set(correct_answers)].sort().join(", ");
    mistake.push(correct_answers);
    mistakes.push(mistake);
  }
  return mistakes;
}

export const Mistakes = (props) => {
  let mistakes_present = props.mistakes.length > 0;
  let mistakes = getCorrectAnswers(props.mistakes);
  let mistake_list_items = mistakes.map(mistake =>
    <tr key={mistake}>
      <td>{mistake[0]}</td>
      <td>{mistake[1]}</td>
      <td>{mistake[2]}</td>
    </tr>
  );
  return (
    <div>
      <h2>Your mistakes:</h2>
      {mistakes_present ?
        <table id="mistakes_table" cellSpacing="0">
          <thead>
            <tr>
              <td>Question</td>
              <td>Your guess</td>
              <td>Correct answers</td>
            </tr>
          </thead>
          <tbody>{mistake_list_items}</tbody>
        </table>
        : <p id="no_mistakes">You have not made any mistakes yet!</p>}
    </div>
  );
};