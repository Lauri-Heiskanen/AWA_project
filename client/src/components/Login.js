import { useEffect, useState } from "react";
import login from "../apiRequests/login";
import { useNavigate } from "react-router-dom";

function Login() {
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='row'>
        <div className='input-field col s12 m6 l6'>
          <input id='input-email' type='text' value={emailText} onChange={(e) => setEmailText(e.target.value)}></input>
          <label for='input-email'>Email</label>
        </div>
        <div className='input-field col s12 m6 l6'>
          <input id='input-password' type='text' value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></input>
          <label for='input-password'>Password</label>
        </div>
      </div>
      <div className='row'>
        <button
          className='btn'
          onClick={() =>
            login(emailText, passwordText, navigate).then((res) => {
              if (res && res.success) {
                console.log("navigating");
                navigate("/");
              }
            })
          }
        >
          Login
        </button>
      </div>

      <div className='row'>
        <button
          className='btn'
          onClick={() => {
            navigate("/register");
          }}
        >
          Register instead
        </button>
      </div>
    </div>
  );
}

export default Login;
