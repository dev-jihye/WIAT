import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { loggedInUserVar } from "apollo";
import Layout from "Components/Layouts/Layout";
import Posts from "Components/Partials/Posts";
import Skin from "Components/Partials/Skin";
import { Loading } from "Components/_SharedStyles";
import { ROUTE } from "constance";
import { dbService } from "fbase";
import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import Error404 from "./Error404";
import PostDetail from "./PostDetail";

const Header = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #c3c2c2;
`;

const Message = styled.p`
  padding: 30px 0 10px 10px;
  font-size: 22px;
  font-weight: 700;
`;

const Btn = styled.button`
  border: 1px solid #dbdada;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 7px;
  font-size: 13px;
  margin: 0 10px;
`;

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState();
  const { blogId } = useParams();
  const loggedInUser = loggedInUserVar();

  useEffect(() => {
    const q = query(
      collection(dbService, "blogs"),
      where("userId", "==", blogId)
    );
    onSnapshot(q, async (snapshot) => {
      const checkBlogExist = snapshot.docs.map((doc) => doc.id);
      if (checkBlogExist.length < 1) {
        if (loggedInUser && loggedInUser.uid === blogId) {
          setLoadingMessage("블로그를 생성중입니다.");
          const blogObj = {
            userId: loggedInUser.uid,
          };
          await addDoc(collection(dbService, "blogs"), blogObj);
          setError(null);
          setLoading(false);
        } else {
          setError("404");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  }, [blogId]);

  const content = error ? (
    <Error404 />
  ) : (
    <>
      <Skin blogId={blogId} loggedInUser={loggedInUser} />
      <Header>
        <Message>I am What I eat</Message>
        {loggedInUser && loggedInUser.uid === blogId && (
          <Link to={ROUTE.CREATE_POST}>
            <Btn>📒 기록하기</Btn>
          </Link>
        )}
      </Header>
      <Routes>
        <Route path="/" element={<Posts blogId={blogId} />} />
        <Route path={`/${ROUTE.POSTS}/:postId`} element={<PostDetail />} />
      </Routes>
    </>
  );

  return (
    <Layout>
      {loading ? (
        <Loading className="sweet-loading">
          <div>
            <ClipLoader color={"#b17122"} loading={true} size={50} />
          </div>
          <div>
            <p>{loadingMessage}</p>
          </div>
        </Loading>
      ) : (
        content
      )}
    </Layout>
  );
};
export default Blog;
