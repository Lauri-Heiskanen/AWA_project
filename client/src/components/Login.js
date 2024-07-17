import { useState } from "react";
import login from "../apiRequests/login";
import checkAuthentication from "../apiRequests/checkAuthentication";
import { useNavigate } from "react-router-dom";

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
      <button
        onClick={() => {
          checkAuthentication(localStorage.getItem("token")).then((isAuthenticated) => {
            console.log(isAuthenticated);
          });
        }}
      >
        Test
      </button>
    </div>
  );
}

export default Login;
