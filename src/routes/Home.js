import Seweet from "../components/Seweet";

import React, { useState, useEffect } from "react";
import { dbService } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import SeweetFactory from "../components/SeweetFactory";

const Home = ({ userObj }) => {
  const [seweets, setSeweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, "seweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const seweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSeweets(seweetArr);
    });
  }, []);


  return (
    <div>
      <SeweetFactory userObj={userObj} />
      <div>
        {seweets.map((seweetObj) => (
          <Seweet
            key={seweetObj.id}
            seweetObj={seweetObj}
            isOwner={seweetObj.creatorId === userObj.uid}
            attachmentUrl={seweetObj.attachmentUrl}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
