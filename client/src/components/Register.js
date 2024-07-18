import { useState } from "react";
import register from "../apiRequests/register";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nameText, setNameText] = useState("nimi asd");
  const [descriptionText, setDescriptionText] = useState("öaklsjdflöaksdfjlökasjfd");
  const [emailText, setEmailText] = useState("1nih@testi.xd");
  const [passwordText, setPasswordText] = useState("123456_Aa");
  localStorage.setItem("token", "");
  const navigate = useNavigate();
  return (
    <>
      <textarea placeholder='Name' value={nameText} onChange={(e) => setNameText(e.target.value)}></textarea>
      <textarea placeholder='Email' value={emailText} onChange={(e) => setEmailText(e.target.value)}></textarea>
      <textarea placeholder='Password' value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></textarea>
      <textarea placeholder='Description' value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)}></textarea>
      <button
        onClick={() => {
          register(nameText, emailText, passwordText, descriptionText).then((res) => {
            if (res.success) {
              localStorage.setItem("token", res.token);
              navigate("/");
            } else {
              localStorage.setItem("token", "");
            }
          });
        }}
      >
        Register
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login instead
      </button>
    </>
  );
}

export default Register;
