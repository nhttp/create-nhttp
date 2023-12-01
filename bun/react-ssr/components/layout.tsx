import { Helmet } from "nhttp-land/jsx";
import { type FC } from "react";

const Layout: FC = (props) => {
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
