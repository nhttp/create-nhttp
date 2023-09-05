import { type RequestEvent } from "nhttp-land";

export default function error(err: Error, rev: RequestEvent) {
  return <h1>{err.message ?? "Something Went Wrong"}</h1>;
}
