import { useEffect } from "react";
import login from "../apiRequests/login";

function Test() {
  useEffect(() => {
    login("asd@b.com", "1Aa_12345", null);
  }, []);
  return (
    <>
      <button
        className='btn'
        onClick={() => {
          fetch("/api", { method: "get", credentials: "same-origin", headers: { "Content-type": "application/json; charset=UTF-8" } });
        }}
      >
        test
      </button>
    </>
  );
}

export default Test;
