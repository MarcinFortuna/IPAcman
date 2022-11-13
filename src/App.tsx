import * as React from 'react';
import './App.css';
import {Main} from './Main';
import {auth} from './Firebase';
import {useState} from "react";
import {User} from "firebase";

const App = () => {

  const [currentUser, setCurrentUser] = useState<User | {email: string}>({email: "test"});

  // auth.onAuthStateChanged( (user: User | null) => {
  //   if (user) {
  //     user = auth.currentUser;
  //     if (user !== null) setCurrentUser(user);
  //     console.log(user?.email);
  //     console.log("Auth state changed!");
  //   } else {
  //     setCurrentUser({email: "test"});
  //   }
  // });

  return (
    <div className="App">
      <Main user={currentUser} />
    </div>
  );
}

export default App;
