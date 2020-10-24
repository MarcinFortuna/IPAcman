import React, {useState} from 'react';
import Popup from 'reactjs-popup';
import { Leaderboard } from './Leaderboard';

export const LeaderboardPopup = () => {
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    return (<div class="leaderboardButton">
      <button type="button" className="button" onClick={() => setOpen(o => !o)}>
        Leaderboard
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <button onClick={closeModal} className="close_button">
            &times;
          </button>
          <h1>Leaderboard</h1>
          <Leaderboard />
        </div>
      </Popup>
    </div>)
  }
  