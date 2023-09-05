import { type RequestEvent } from "nhttp-land";

export default function notFound(rev: RequestEvent) {
  return <h1>Not Found</h1>;
}
