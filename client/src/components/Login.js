import { useState } from "react";
import login from "../apiRequests/login";
import checkAuthentication from "../apiRequests/checkAuthentication";
import { useNavigate } from "react-router-dom";
import getDescription from "../apiRequests/getDescription";

function Login({ email, password }) {
  const [emailText, setEmailText] = useState(email);
  const [passwordText, setPasswordText] = useState(password);
  localStorage.setItem("token", "");
  const navigate = useNavigate();

  return (
    <div>
      <textarea value={emailText} onChange={(e) => setEmailText(e.target.value)}></textarea>
      <textarea value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></textarea>
      <button
        onClick={() =>
          login(emailText, passwordText).then((res) => {
            console.log(res);
            if (res.success) {
              localStorage.setItem("token", res.token);
              navigate("/");
            } else {
              localStorage.setItem("token", "");
            }
          })
        }
      >
        Login
      </button>
      <button onClick={() => getDescription("6696c3b71e6c57ae09d14977").then(console.log)}>Test</button>
    </div>
  );
}

export default Login;
