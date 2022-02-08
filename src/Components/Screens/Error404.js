import { Link } from "react-router-dom";
import styled from "styled-components";

const MainText = styled.p`
  color: #9d7b48;
`;

const HomeBtn = styled.p`
  background-color: #f5b351;
  border-radius: 4px;
`;

const Error404 = ({ url = "/" }) => {
  return (
    <>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <MainText className="text-4xl font-extrabold sm:text-5xl">
              404
            </MainText>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <HomeBtn>
                  <Link
                    to={url}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 "
                  >
                    Go back home
                  </Link>
                </HomeBtn>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Error404;
