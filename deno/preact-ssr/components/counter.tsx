import { useState } from "preact/hooks";
import { withHydrate } from "hydrate";

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button
        onClick={() => setCount(count + 1)}
        className="text-white bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-900"
      >
        Increment
      </button>
      <span className="m-5 text-2xl">{count}</span>
      <button
        onClick={() => setCount(count - 1)}
        className="text-white bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-900"
      >
        Decrement
      </button>
    </>
  );
};

// HOC client-interactive
export default withHydrate(Counter, import.meta.url);
