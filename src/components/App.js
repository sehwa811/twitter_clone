import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  //userObj가 존재하면 로그인 된 것, 존재하지 않으면 로그인 안된 것

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
        //나중에 이 유저 정보를 쓸 수 있도록 변수에 저장
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
    });
  };

  /* const refreshUser = async() => {
    await updateCurrentUser)auth, auth.currentUSer);
    setUserObj(auth.currentUser);
  } */

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Sewitter</footer> */}
    </>
  );
}

export default App;
