import * as React from 'react';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import { FormContainer } from './FormContainer';

export const SignInSignUpPopup = () => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (<div>
    <button type="button" className="button" onClick={() => setOpen(o => !o)}>
      Sign In
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
