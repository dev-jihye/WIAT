import { Link } from "react-router-dom";
import styled from "styled-components";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { authService } from "fbase";
import { loggedInUserVar } from "../../apollo";
import { ROUTE } from "constance";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding: 10px 0;
`;

const Span = styled.span`
  background-color: #e9b972;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const Ul = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
  li {
    margin-left: 20px;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-family: "Montserrat Alternates", sans-serif;
  margin: 0 40px 0 10px;
`;

const Btn = styled.button`
  &:hover {
    background-color: #f3f4f6;
  }
`;

const Navigation = () => {
  const loggedInUser = loggedInUserVar();
  const onLogOutClick = () => {
    authService.signOut();
    loggedInUserVar(null);
  };
  return (
    <nav>
      <Wrapper>
        <Title>
          <Link to="/">What I Ate Today</Link>
        </Title>
        <Ul>
          {loggedInUser ? (
            <li>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full font-medium ">
                    <Span>My</Span>
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
                  <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={`${ROUTE.BLOG}/${loggedInUser.uid}`}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            내 홈
                          </Link>
                        )}
                      </Menu.Item>
                      <form>
                        <Menu.Item>
                          <Btn
                            type="submit"
                            onClick={onLogOutClick}
                            className="block w-full text-left px-4 py-2 text-sm"
                          >
                            로그아웃
                          </Btn>
                        </Menu.Item>
                      </form>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          ) : (
            <Link to={ROUTE.AUTH}>로그인</Link>
          )}
        </Ul>
      </Wrapper>
    </nav>
  );
};

export default Navigation;
