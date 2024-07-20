import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getUser from "../apiRequests/getUser";
import updateName from "../apiRequests/updateName";
import updateEmail from "../apiRequests/updateEmail";
import updateDescription from "../apiRequests/updateDescription";
import updatePassword from "../apiRequests/updatePassword";

function EditProfile() {
  const navigate = useNavigate();

  const [nameText, setNameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");

  useEffect(() => {
    getUser().then((user) => {
      // if text is still "" set it to the fetched value
      // also add "active" to corresponding labels classes to avoid overlapping
      if (nameText == "") {
        setNameText(user.name);
        document.getElementById("name-label").classList.add("active");
      }
      if (descriptionText == "") {
        setDescriptionText(user.description);
        document.getElementById("description-label").classList.add("active");
      }
      if (emailText == "") {
        setEmailText(user.email);
        document.getElementById("email-label").classList.add("active");
      }
    });
  }, []);

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='input-field col s12'>
            <input id='input-name' type='text' value={nameText} onChange={(e) => setNameText(e.target.value)}></input>
            <label id='name-label' for='input-name' className='active'>
              Name
            </label>
          </div>
          <div className='input-field col s12'>
            <input id='input-email' type='text' value={emailText} onChange={(e) => setEmailText(e.target.value)}></input>
            <label id='email-label' for='input-email'>
              Email
            </label>
          </div>
          <div className='input-field col s12'>
            <input id='input-password' type='text' value={passwordText} onChange={(e) => setPasswordText(e.target.value)}></input>
            <label for='input-password'>Password</label>
          </div>
          <div className='input-field col s12'>
            <textarea
              id='desc-textarea'
              className='materialize-textarea'
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            ></textarea>
            <label id='description-label' for='desc-textarea'>
              Description
            </label>
          </div>
        </div>
        <div className='row'>
          <button
            className='btn'
            onClick={() => {
              getUser().then((user) => {
                // if text is still "" set it to the fetched value
                nameText == "" || nameText == user.name
                  ? (() => {
                      console.log("not changing name");
                    })()
                  : updateName(nameText, navigate);
                descriptionText == "" || descriptionText == user.description
                  ? (() => {
                      console.log("not changing desc");
                    })()
                  : updateDescription(descriptionText, navigate);
                emailText == "" || emailText == user.email
                  ? (() => {
                      console.log("not changing email");
                    })()
                  : updateEmail(emailText, navigate);
                updatePassword(passwordText, navigate);
              });
              navigate("/");
            }}
          >
            Save Changes
          </button>
        </div>
        <div className='row'>
          <button
            className='btn'
            onClick={() => {
              navigate("/");
            }}
          >
            Back to main view
          </button>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
