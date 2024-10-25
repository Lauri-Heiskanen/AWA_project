import { useState } from "react";
import register from "../apiRequests/register";
import login from "../apiRequests/login";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nameText, setNameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className='container'>
        <div className='input-field col s12'>
          <input id='input-name' type='text' value={nameText} onChange={(e) => setNameText(e.target.value)}></input>
          <label for='input-name'>Name</label>
        </div>
        <div className='input-field col s12'>
          <input id='input-email' type='text' value={emailText} onChange={(e) => setEmailText(e.target.value)}></input>
          <label for='input-email'>Email</label>
        </div>
        <div className='input-field col s12'>
          <input id='input-password' type='text' value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></input>
          <label for='input-password'>Password</label>
        </div>
        <div className='input-field col s12'>
          <textarea id='desc-textarea' className='materialize-textarea' value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)}></textarea>
          <label for='desc-textarea'>Description</label>
        </div>
        <button
          className='btn'
          onClick={() => {
            register(nameText, emailText, passwordText, descriptionText, navigate).then((res) => {
              if (res && res.success) {
                // if registeration is successful, log in
                login(emailText, passwordText, navigate).then((res) => {
                  if (res && res.success) {
                    navigate("/");
                  }
                });
              }
            });
          }}
        >
          Register
        </button>
        <br />
        <br />
        <button
          className='btn'
          onClick={() => {
            navigate("/login");
          }}
        >
          Login instead
        </button>
      </div>
    </>
  );
}

export default Register;
