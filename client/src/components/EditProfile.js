import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getUser from "../apiRequests/getUser";
import updateName from "../apiRequests/updateName";
import updateEmail from "../apiRequests/updateEmail";
import updateDescription from "../apiRequests/updateDescription";
import updatePassword from "../apiRequests/updatePassword";

function EditProfile() {
  const navigate = useNavigate();
  useEffect(() => {
    checkAuthentication(localStorage.getItem("token")).then((isAuthenticated) => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    });
  });

  const [nameText, setNameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  getUser().then((user) => {
    // if text is still "" set it to the fetched value
    nameText != "" ? (() => {})() : setNameText(user.name);
    descriptionText != "" ? (() => {})() : setDescriptionText(user.description);
    emailText != "" ? (() => {})() : setEmailText(user.email);
  });

  return (
    <>
      <textarea placeholder='Name' value={nameText} onChange={(e) => setNameText(e.target.value)}></textarea>
      <textarea placeholder='Email' value={emailText} onChange={(e) => setEmailText(e.target.value)}></textarea>
      <textarea placeholder='Description' value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)}></textarea>
      <textarea placeholder='Password' value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></textarea>
      <button
        onClick={() => {
          getUser().then((user) => {
            // if text is still "" set it to the fetched value
            nameText == "" || nameText == user.name
              ? (() => {
                  console.log("not changing name");
                })()
              : updateName(nameText);
            descriptionText == "" || descriptionText == user.description
              ? (() => {
                  console.log("not changing desc");
                })()
              : updateDescription(descriptionText);
            emailText == "" || emailText == user.email
              ? (() => {
                  console.log("not changing email");
                })()
              : updateEmail(emailText);
            updatePassword(passwordText);
          });
        }}
      >
        Save Changes
      </button>
      <br />
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        Back to main view
      </button>
    </>
  );
}

export default EditProfile;
