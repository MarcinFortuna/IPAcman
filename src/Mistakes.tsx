import * as React from 'react';
import { phonemes } from './RP_segments_API';
import {MistakeType} from "./types/types";

interface MistakesProps {
  mistakes: MistakeType[]
}

export const getCorrectAnswers = (mistakes_arr: MistakeType[]) => {
  let mistakes: string[][] = [];

  for (let i = 0; i < mistakes_arr.length; i++) {
    let mistake = [];
    mistake.push(mistakes_arr[i]["guessedQuestion"]["question"]);
    mistake.push(mistakes_arr[i]["guessedPhoneme"]["ipa"]);
    let correct_answers: string[] = []
    for (let j = 0; j < phonemes.length; j++) {
      for (let prop in phonemes[j]) {
        // @ts-ignore
        if (mistakes_arr[i]["guessedQuestion"]["classes"].includes(phonemes[j][prop])) {
          correct_answers.push(phonemes[j]["ipa"]);
        }
      }
    }
    let correct_answers_str: string = [...new Set(correct_answers)].sort().join(", ");
    mistake.push(correct_answers_str);
    mistakes.push(mistake);
  }
  return mistakes;

}

export const Mistakes = (props: MistakesProps) => {

  let mistakes_present: boolean = props.mistakes.length > 0;
  let mistakes: string[][] = getCorrectAnswers(props.mistakes);

  let mistake_list_items: JSX.Element[] = mistakes.map((mistake: string[], i: number) =>
    <tr key={i}>
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