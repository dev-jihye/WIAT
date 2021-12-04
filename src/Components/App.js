import AppRouter from "Components/Router";
import { useEffect, useState } from "react";
import { authService } from "../fbase";
import ClipLoader from "react-spinners/ClipLoader";
import { ContentWrapper, Loading } from "./_SharedStyles";
import { useReactiveVar } from "@apollo/client";
import { loggedInUserVar } from "apollo";

function App() {
  const [init, setInit] = useState(false);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const checkAuth = () => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        loggedInUserVar(user);
      } else {
        loggedInUserVar(null);
      }
      setInit(true);
    });
  };
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ContentWrapper>
      {init ? (
        <AppRouter loggedInUser={loggedInUser} />
      ) : (
        <Loading className="sweet-loading">
          <ClipLoader color={"#b17122"} loading={true} size={50} />
        </Loading>
      )}
    </ContentWrapper>
  );
}

export default App;
