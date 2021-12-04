import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "fbase";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import { AuthButton, ChangeAuth } from "Components/_SharedStyles";
import { useNavigate } from "react-router-dom";
import { loggedInUserVar } from "../../apollo";
import { ROUTE } from "constance";

const Login = () => {
  const navigate = useNavigate();
  const loggedInUser = loggedInUserVar();
  useEffect(() => {
    if (loggedInUser) {
      navigate(ROUTE.HOME);
    }
  }, [loggedInUser]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (e) => {
    try {
      const {
        target: { name },
      } = e;
      let provider;
      if (name === "google") {
        provider = new GoogleAuthProvider();
      } else if (name === "facebook") {
        provider = new FacebookAuthProvider();
      }
      const data = await signInWithPopup(authService, provider);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" method="POST" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={onChange}
                  value={email}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={onChange}
                  value={password}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-red-600">{error}</div>
            <div>
              <AuthButton
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 "
                value={newAccount ? "회원가입" : "로그인"}
              />
            </div>
          </form>
          <ChangeAuth
            className="mt-6 text-sm w-full flex justify-center"
            onClick={toggleAccount}
          >
            {newAccount ? "로그인" : "회원가입"}
          </ChangeAuth>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  소셜 연동하기
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={onSocialClick}
                  name="google"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-md font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <FontAwesomeIcon icon={faGoogle} />
                </button>
              </div>

              <div>
                <button
                  onClick={onSocialClick}
                  name="facebook"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-md font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <FontAwesomeIcon icon={faFacebookSquare} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
