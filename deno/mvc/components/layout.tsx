import { FC, Helmet } from "@nhttp/nhttp/jsx";

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
