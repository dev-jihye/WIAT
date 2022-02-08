import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { loggedInUserVar } from "apollo";
import Layout from "Components/Layouts/Layout";
import { ROUTE } from "constance";
import { dbService, storageService } from "fbase";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

const Span = styled.span`
  color: #897d6e;
`;

const Btn = styled.button`
  background-color: #897d6e;
  &:hover {
    background-color: #6a5f50;
  }
`;

const PreviewBox = styled.div`
  position: relative;
  z-index: 0;
`;

const LabelButton = styled.label`
  position: absolute;
  right: 15px;
  bottom: 15px;
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

const CreatePost = () => {
  const loggedInUser = loggedInUserVar();
  const [title, setTitle] = useState("");
  const [attachment, setAttachment] = useState("");
  const [posting, setPosting] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let attachmentUrl = "";
    const attachmentRef = ref(
      storageService,
      `${loggedInUser.uid}/${uuidv4()}`
    );
    await uploadString(attachmentRef, attachment, "data_url");
    attachmentUrl = await getDownloadURL(attachmentRef);
    if (posting === "" && attachmentUrl === "") {
      return;
    }
    const postObj = {
      title: title,
      text: posting,
      createdAt: Date.now(),
      creatorId: loggedInUser.uid,
      attachmentUrl,
    };

    await addDoc(collection(dbService, "posts"), postObj);
    setTitle("");
    setPosting("");
    setLoading(false);
    navigate(`${ROUTE.BLOG}/${loggedInUser.uid}`);
  };

  const onTitleChange = (e) => {
    const {
      target: { value },
    } = e;
    setTitle(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
    const url = URL.createObjectURL(theFile);
    setFilePreview(url);
  };
  const onPostChange = (e) => {
    const {
      target: { value },
    } = e;
    setPosting(value);
  };
  return (
    <Layout>
      <form onSubmit={onSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5 mx-4">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="title"
                  className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Title
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="max-w-lg flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      autoComplete="title"
                      onChange={onTitleChange}
                      className="flex-1 block w-full min-w-0 rounded-md sm:text-sm border-gray-300 focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <span className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Photo
                </span>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  {filePreview ? (
                    <PreviewBox className="max-w-lg flex justify-center overflow-hidden border-2 border-gray-300 border-dashed rounded-md">
                      <img src={filePreview} />
                      <LabelButton htmlFor="file-upload">수정</LabelButton>
                    </PreviewBox>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="max-w-lg cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                    >
                      <div className="space-y-1 text-center flex flex-col justify-center items-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <div className="relative  bg-white rounded-md font-medium 500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2">
                            <Span>Upload a photo</Span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  )}
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileChange}
                />
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="content"
                  className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Contents
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="content"
                    name="content"
                    rows={3}
                    className="max-w-lg shadow-sm block w-full focus:ring-0 sm:text-sm border border-gray-300 rounded-md"
                    defaultValue={""}
                    onChange={onPostChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 mx-4">
          <div className="flex justify-end">
            <Link
              to={`/blog/${loggedInUser.uid}`}
              className="bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-0 focus:ring-offset-2 "
            >
              Cancel
            </Link>
            <Btn
              type="submit"
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-0 focus:ring-offset-2 ${
                loading && "opacity-50"
              }`}
              disabled={loading}
            >
              {loading ? "Loading" : "Save"}
            </Btn>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default CreatePost;
