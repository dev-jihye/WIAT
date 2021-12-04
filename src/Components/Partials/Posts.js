import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { Loading } from "Components/_SharedStyles";
import { dbService } from "fbase";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import Post from "./Post";

const PostWrapper = styled.div``;

const PostRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px 10px;
`;

const Posts = ({ blogId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(
      collection(dbService, "posts"),
      where("creatorId", "==", blogId),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
      setLoading(false);
    });
  }, [blogId]);
  return (
    <div>
      {loading ? (
        <Loading className="sweet-loading" style={{ height: "300px" }}>
          <ClipLoader color={"#b17122"} loading={true} size={50} />
        </Loading>
      ) : (
        <PostWrapper>
          <PostRow>
            {posts.map((post) => (
              <Post post={post} key={post.id} />
            ))}
          </PostRow>
        </PostWrapper>
      )}
    </div>
  );
};

export default Posts;
