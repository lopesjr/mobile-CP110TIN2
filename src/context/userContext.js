import React, {createContext, useState, useEffect, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UserContext = createContext({
  userType: null,
  setUserType: () => null,
  user: null,
  userData: null,
  getUserData: null,
});

export const UserProvider = ({children}) => {
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    const userDoc = await firestore().collection('Users').doc(user.uid).get();
    const userDataAux = userDoc.data();
    setUserData(userDataAux);
    setUserType(userDataAux.userType);
  };

  const onAuthStateChanged = async user => {
    if (user) {
      const userDoc = await firestore().collection('Users').doc(user.uid).get();
      const userDataAux = userDoc.data();

      if (userDataAux != null) {
        setUserData(userDataAux);
        setUserType(userDataAux.userType);
      } else {
        setUserData(null);
      }
    } else {
      setUser(null);
      setUserType(null);
      setUserData(null);
    }

    setUser(user);

    // splash off
  };

  useEffect(() => {
    // splash on

    const subscriber = auth().onAuthStateChanged(user =>
      onAuthStateChanged(user),
    );
    return subscriber;
  }, []);

  return (
    <UserContext.Provider
      value={{
        userType: userType,
        setUserType: setUserType,
        user: user,
        userData: userData,
        getUserData: getUserData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export function UseUserData() {
  const context = useContext(UserContext);
  return context;
}
