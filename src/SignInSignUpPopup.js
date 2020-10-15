import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { FormContainer } from './FormContainer';

export const SignInSignUpPopup = (props) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (<div>
    <button type="button" className="button" onClick={() => setOpen(o => !o)}>
      Register
    </button>
    <Popup open={open} closeOnDocumentClick onClose={closeModal}>
      <div className="modal">
        <button onClick={closeModal} className="close_button">
          &times;
        </button>
        <FormContainer />
      </div>
    </Popup>
  </div>)
}
