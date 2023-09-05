import { Helmet } from "nhttp/jsx.ts";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <Helmet>
        <link rel="icon" href="/assets/img/favicon.ico" />
      </Helmet>
      {props.children}
    </>
  );
}
