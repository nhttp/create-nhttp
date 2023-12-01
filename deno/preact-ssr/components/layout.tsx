import { Helmet } from "nhttp/jsx.ts";
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
