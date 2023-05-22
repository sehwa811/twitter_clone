import React, { useEffect, useState } from "react";
import { auth, dbService } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth"

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();

  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const getMySeweets = async () => {
    /* dbService의 컬렉션 중 "nweets" Docs에서 
      userObj의 uid와 동일한 creatorID를 가진 모든 문서를 
      내림차순으로 가져오는 쿼리(요청) 생성 */
    const q = query(
      collection(dbService, "seweets"),
      where("creatorId", "==", userObj.uid),
      //where은 여기저기 활용할 수 있다. 매우 강력한 기능임
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    getMySeweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, {displayName: newDisplayName});
    }
    refreshUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
