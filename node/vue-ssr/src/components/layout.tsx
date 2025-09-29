import { Helmet } from "@nhttp/nhttp/jsx";
import { type FC, type JSX } from "react";

const Layout: FC<{ children?: JSX.Element[] }> = (props) => {
  return (
    <>
      <Helmet>
        <link rel="icon" href="/assets/img/favicon.ico" />
      </Helmet>
      {props.children}
    </>
  );
};

export default Layout;
