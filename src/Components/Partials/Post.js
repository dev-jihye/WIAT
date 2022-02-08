import { Link } from "react-router-dom";
import styled from "styled-components";

const PostBox = styled.div`
  border: 1px solid #e1e0e0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 2px 2px 7px 0px rgb(219 218 218 / 60%);
  @media (max-width: 640px) {
    margin: 20px 0px;
  }
`;

const Bg = styled.div`
  background: url(${(props) => props.src}) center;
  width: 100%;
  min-height: 160px;
  background-size: cover;
`;

const CreatedAt = styled.p`
  font-size: 13px;
  padding: 10px;
`;

const Title = styled.p`
  padding: 0 10px 10px 10px;
  font-size: 14px;
`;

const Post = ({ post }) => {
  return (
    <PostBox>
      <Link to={`posts/${post.id}`}>
        <Bg src={post.attachmentUrl} />
        <CreatedAt>
          {new Date(post.createdAt).toISOString().slice(0, 10)}
        </CreatedAt>
        <Title>{post.title}</Title>
      </Link>
    </PostBox>
  );
};

export default Post;
