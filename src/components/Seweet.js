import React, { useState } from "react";
import { dbService } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { storageService } from "../firebase";

const Seweet = ({ seweetObj, isOwner, attachmentUrl }) => {
  const SeweetTextRef = doc(dbService, "seweets", `${seweetObj.id}`);
  const SeweetUrlRef = ref(storageService, seweetObj.attachmentUrl);

  const [editing, setEditing] = useState(false);
  const [newSeweet, setNewSeweet] = useState(seweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this seweet?");
    if (ok) {
      await deleteDoc(SeweetTextRef);
      if (seweetObj.attachment === ""){
        await deleteObject(SeweetUrlRef);
      }
    }
  };
  
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(SeweetTextRef, { text: newSeweet });
    setEditing(false);
  };

  const onChange = (e) => {
    setNewSeweet(e.target.value);
  };

  return (
    //editing이 true면 edit input 보여주고, false
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your Seweet"
              value={newSeweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="update seweet"></input>
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{seweetObj.text}</h4>
          {attachmentUrl && (
            <img src={attachmentUrl} alt="img" width="50px" heigh="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Seweet</button>
              <button onClick={toggleEditing}>Edit Seweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Seweet;
