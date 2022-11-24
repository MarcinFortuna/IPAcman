import * as React from 'react';
import './App.css';
import {Main} from './Main';
import {auth} from './Firebase';
import {useEffect, useState} from "react";
import {User, onAuthStateChanged} from "firebase/auth";
import { ChakraProvider } from '@chakra-ui/react';

const App = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        user = auth.currentUser;
        if (user !== null) setCurrentUser(user);
        console.log(user?.email);
        console.log("Auth state changed!");
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

  return (
      <ChakraProvider>
        <div className="App">
          <Main user={currentUser} />
        </div>
      </ChakraProvider>
  );
};

export default App;
