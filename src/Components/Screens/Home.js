import { loggedInUserVar } from "apollo";
import Layout from "Components/Layouts/Layout";
import { ROUTE } from "constance";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Intro = styled.div`
  height: 720px;
  background-color: #f9f0e6;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  padding-top: 300px;
`;

const Btn = styled.button`
  border-radius: 4px;
  padding: 10px 15px;
  pointer-events: fill;
  background-color: #f5b351;
  margin-top: 50px;
`;

const Home = ({}) => {
  const loggedInUser = loggedInUserVar();
  return (
    <Layout>
      <Intro>
        <Title>오늘 하루 내가 먹은 것을 기록하는 식단 다이어리</Title>
        {!loggedInUser ? (
          <Btn>
            <Link to={ROUTE.AUTH}>지금 시작하기</Link>
          </Btn>
        ) : (
          <Btn>
            <Link
              to={`/blog/${loggedInUser.uid}`}
              style={{ verticalAlign: "sub" }}
            >
              내 홈으로 가기
            </Link>
          </Btn>
        )}
      </Intro>
    </Layout>
  );
};
export default Home;
