import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import {
  addDoc,
  collection,
} from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";


const SeweetFactory = ({ userObj }) => {
    const [seweet, setSeweet] = useState(""); //input칸
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
    
        if (attachment !== "") {
          const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
          const response = await uploadString(
            attachmentRef,
            attachment,
            "data_url"
          );
          attachmentUrl = await getDownloadURL(ref(response.ref));
          //이 attachmentUrl은 lexical변수(지역변수)이므로 밖에서 미리 let 으로 선언해준 후 여기서 재선언한다
        }
        
        //만약 첨부파일이 없으면 attachment는 계속 ""
        const seweetObj = {
          text: seweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl,
        };
        await addDoc(collection(dbService, "seweets"), seweetObj);
        setSeweet("");
        setAttachment("");
      };
    
      const onChange = (e) => {
        const {
          target: { value },
        } = e;
        setSeweet(value);
      };
    
      const onFileChange = (e) => {
        const {
          target: { files },
        } = e;
        const theFile = files[0];
        //files의 0번째 인덱스에 파일정보가 들어있음
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
          //console.log(finishedEvent);
          const {
            currentTarget: { result },
          } = finishedEvent;
          setAttachment(result);
        };
        //밑의 readAsDataUrl의 실행이 끝나면 위의 onloadend 이벤트가 발생됨
        reader.readAsDataURL(theFile);
      };
    
      const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit}>
        <input
          value={seweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Sewitt" />
        {attachment && (
          <div>
            <img src={attachment} alt="img" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
    )
}

export default SeweetFactory;