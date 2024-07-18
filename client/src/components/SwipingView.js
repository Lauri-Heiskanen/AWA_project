import { useEffect, useState } from "react";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getUserToShow from "../apiRequests/getUserToShow";
import like from "../apiRequests/likeUser";
import dislike from "../apiRequests/dislikeUser";

function SwipingView({ name, description, id }) {
  const [nameText, setNameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [targetId, setTargetId] = useState("");
  useEffect(() => {
    getUserToShow()
      .then((newUser) => {
        if (newUser) {
          setNameText(newUser.name);
          setDescriptionText(newUser.description);
          setTargetId(newUser.id);
        }
      })
      .catch(() => {
        setNameText("");
        setDescriptionText("");
        setTargetId("");
      });
  }, []);

  return (
    <>
      <div>
        <div>
          <h3>{nameText}</h3>
          <br />
          <p>{descriptionText}</p>
        </div>

        <button
          onClick={() => {
            dislike(targetId);
            getUserToShow()
              .then((newUser) => {
                if (newUser) {
                  setNameText(newUser.name);
                  setDescriptionText(newUser.description);
                  setTargetId(newUser.id);
                }
              })
              .catch(() => {
                setNameText("");
                setDescriptionText("");
                setTargetId("");
              });
          }}
        >
          <img src='/leftArrow.png' width='64px' height='64px' alt='dislike button' />
        </button>
        <button
          onClick={() => {
            like(targetId);
            getUserToShow()
              .then((newUser) => {
                if (newUser) {
                  setNameText(newUser.name);
                  setDescriptionText(newUser.description);
                  setTargetId(newUser.id);
                }
              })
              .catch(() => {
                setNameText("");
                setDescriptionText("");
                setTargetId("");
              });
          }}
        >
          <img src='/rightArrow.png' width='64px' height='64px' alt='like button' />
        </button>
      </div>
    </>
  );
}

export default SwipingView;
