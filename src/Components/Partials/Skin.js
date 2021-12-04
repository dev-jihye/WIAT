import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const Bg = styled.div`
  background-image: url(${(props) => (props.src ? props.src : "")});
  background-size: cover;
  background-position: center;
  background-color: #f3ebdd;
  width: 100%;
  height: 240px;
  position: relative;
  z-index: 0;
`;

const BgActions = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 15px;
`;

const ButtonLabel = styled.label`
  cursor: pointer;
  border-radius: 4px;
  background-color: white;
  padding: 4px 8px;
  opacity: 0.7;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
  &:hover {
    opacity: 0.9;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Skin = ({ blogId, loggedInUser }) => {
  const DEFAULT_SKIN = {
    id: 0,
    attachmentUrl: "",
  };
  const [skin, setSkin] = useState(DEFAULT_SKIN);
  const [loading, setLoading] = useState(false);

  const updateSkin = async (event) => {
    setLoading(true);
    const { target } = event;
    const theFile = target.files[0];
    if (!theFile) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;

      const attachmentRef = ref(
        storageService,
        `${loggedInUser.uid}/${uuidv4()}`
      );
      await uploadString(attachmentRef, result, "data_url");
      const attachmentUrl = await getDownloadURL(attachmentRef);

      const skinObj = {
        creatorId: loggedInUser.uid,
        attachmentUrl,
        createdAt: Date.now(),
      };

      if (skin.attachmentUrl !== "") {
        // 있으면 업데이트
        const skinRef = doc(dbService, "skins", `${skin.id}`);
        await updateDoc(skinRef, {
          attachmentUrl,
          createdAt: Date.now(),
        });
        setSkin({
          id: skin.id,
          attachmentUrl,
        });
      } else {
        // 없으면 새로 만들기
        const newSkin = await addDoc(collection(dbService, "skins"), skinObj);
        setSkin({
          id: newSkin.id,
          attachmentUrl,
        });
      }
      setLoading(false);
    };
    reader.readAsDataURL(theFile);
  };

  useEffect(() => {
    const q = query(
      collection(dbService, "skins"),
      where("creatorId", "==", blogId),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const checkBlogExist = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (checkBlogExist.length >= 1) {
        setSkin(checkBlogExist[0]);
      } else {
        setSkin(DEFAULT_SKIN);
      }
    });
  }, [blogId]);

  return (
    <Bg src={skin.attachmentUrl}>
      {loggedInUser && loggedInUser.uid === blogId && (
        <BgActions>
          <ButtonLabel htmlFor="skin" disabled={loading}>
            {loading ? "로딩..." : "수정"}
          </ButtonLabel>
          <HiddenInput
            id="skin"
            type="file"
            accept="image/*"
            onChange={updateSkin}
          />
        </BgActions>
      )}
    </Bg>
  );
};

export default Skin;
