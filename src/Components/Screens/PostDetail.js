import { deleteDoc, doc, getDoc } from "@firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading } from "Components/_SharedStyles";
import { dbService, storageService } from "fbase";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styled from "styled-components";
import Error404 from "./Error404";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { loggedInUserVar } from "apollo";
import { Menu, Transition } from "@headlessui/react";
import { deleteObject, ref } from "@firebase/storage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Wrap = styled.div`
  padding: 20px 30px;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 640px) {
    display: block;
  }
`;

const PostContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.div`
  margin-right: 10px;
`;

const PostTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 10px;
  flex-grow: 1;
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const PostDate = styled.p`
  margin-right: 10px;
  font-size: 14px;
`;

const Btn = styled.button`
  &:hover {
    background-color: #f3f4f6;
  }
`;

const PostText = styled.p`
  margin: 20px 0;
`;

const PostDetail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [post, setPost] = useState();
  const { blogId, postId } = useParams();
  const loggedInUser = loggedInUserVar();
  const navigate = useNavigate();
  useEffect(async () => {
    setLoading(true);
    setPost(null);
    const docRef = doc(dbService, "posts", `${postId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPost(docSnap.data());
      setError(null);
      setLoading(false);
    } else {
      setError("404");
      setLoading(false);
    }
  }, [postId]);

  const onDeleteClick = async () => {
    const docRef = doc(dbService, "posts", `${postId}`);
    const ok = window.confirm("게시물을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(docRef);
      await deleteObject(ref(storageService, post.attachmentUrl));
      navigate(`/blog/${blogId}`);
    }
  };

  return (
    <Wrap>
      {loading ? (
        <Loading className="sweet-loading">
          <div>
            <ClipLoader color={"#b17122"} loading={true} size={50} />
          </div>
        </Loading>
      ) : (
        <div>
          {error ? (
            <Error404 url={`/blog/${blogId}`} />
          ) : (
            <>
              <PostHeader>
                <PostContainer>
                  <Link to={`/blog/${post.creatorId}`}>
                    <Icon>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </Icon>
                  </Link>
                  <PostTitle>{post.title}</PostTitle>
                </PostContainer>
                <PostContainer>
                  <PostDate>
                    {new Date(post.createdAt).toISOString().slice(0, 10)}
                  </PostDate>
                  {loggedInUser && loggedInUser.uid === blogId && (
                    <>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="inline-flex justify-center w-full font-medium ">
                            <FontAwesomeIcon icon={faEllipsisH} />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-20 text-center rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to={`/blog/${blogId}/edit-post/${postId}`}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    수정
                                  </Link>
                                )}
                              </Menu.Item>
                              <form>
                                <Menu.Item>
                                  <Btn
                                    onClick={onDeleteClick}
                                    type="submit"
                                    className="block w-full px-4 py-2 text-sm text-center"
                                  >
                                    삭제
                                  </Btn>
                                </Menu.Item>
                              </form>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  )}
                </PostContainer>
              </PostHeader>
              <img src={post.attachmentUrl} alt="post_image" />
              <PostText>{post.text}</PostText>
            </>
          )}
        </div>
      )}
    </Wrap>
  );
};

export default PostDetail;
