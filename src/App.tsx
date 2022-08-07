import * as React from 'react';
import './App.css';
import { Main } from './Main';
import { auth } from './Firebase';
import {useState} from "react";


const App = () => {
  const [currentUser, authUser] = useState({});

  auth.onAuthStateChanged(function (user) {
    if (user) {
      user = auth.currentUser;
      authUser(user);
      console.log(user.email);
      console.log("Auth state changed!");
    } else {
      // @ts-ignore
      if (currentUser.email) authUser({});
      // console.log(currentUser);
    }
  });

  return (
    <div className="App">
      <Main user={currentUser} />
    </div>
  );
}

export default App;
