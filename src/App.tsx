import * as React from 'react';
import {Main} from './components/Main';
import {auth} from './api/Firebase';
import {useEffect, useState} from "react";
import {User, onAuthStateChanged} from "firebase/auth";
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

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

  const ipacmanTheme = extendTheme({
    styles: {
      global: {
        body: {
          backgroundColor: "#e8d55d"
        }
      }
    },
    colors: {
      mainYellow: "#e8d55d"
    }
  });

  return (
      <ChakraProvider cssVarsRoot='#app' theme={ipacmanTheme}>
        <div id="app">
          <Main user={currentUser} />
        </div>
      </ChakraProvider>
  );
};

export default App;
