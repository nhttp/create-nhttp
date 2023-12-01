import { Helmet } from "nhttp-land/jsx";
import { type FunctionComponent as FC } from "preact";

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
