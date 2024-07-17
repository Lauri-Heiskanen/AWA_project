import { useState } from "react";
import login from "../apiRequests/login";

function Login() {
  const [emailText, setEmailText] = useState("asd@b.com");
  const [passwordText, setPasswordText] = useState("1Aa_12345");
  const [token, setToken] = useState("");
  return (
    <div>
      <textarea value={emailText} onChange={(e) => setEmailText(e.target.value)}></textarea>
      <textarea value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></textarea>
      <button
        onClick={() =>
          login(emailText, passwordText).then((res) => {
            console.log(res);
            setToken(res.token);
            if (res.success) {
              setToken(res.token);
              fetch("/api/", {
                method: "get",
                headers: { Authorization: "Bearer " + res.token, "Content-type": "application/json; charset=UTF-8" },
              }).then(console.log);
              fetch("/api/token", {
                method: "get",
                headers: { Authorization: "Bearer " + res.token, "Content-type": "application/json; charset=UTF-8" },
              })
                .then((res) => res.json())
                .then(console.log);
            } else {
              setToken("");
            }
          })
        }
      >
        Login
      </button>
    </div>
  );
}

export default Login;
