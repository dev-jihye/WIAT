import Navigation from "Components/Partials/Navigation";
import styled from "styled-components";

const Wrap = styled.div`
  padding-bottom: 40px;
`;

const Layout = ({ children }) => {
  return (
    <Wrap>
      <Navigation />
      {children}
    </Wrap>
  );
};

export default Layout;
