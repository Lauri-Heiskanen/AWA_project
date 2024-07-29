import { useEffect, useState } from "react";
import getUserToShow from "../apiRequests/getUserToShow";
import like from "../apiRequests/likeUser";
import dislike from "../apiRequests/dislikeUser";
import { useNavigate } from "react-router-dom";
import getMatches from "../apiRequests/getMatches";

function SwipingView({ setMatchedUsers }) {
  const [nameText, setNameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [targetId, setTargetId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUserToShow(navigate).then((newUser) => {
      if (newUser) {
        setNameText(newUser.name);
        setDescriptionText(newUser.description);
        setTargetId(newUser.id);
      } else {
        setNameText("Sorry, couldn't find users to show you");
        setDescriptionText("Perhaps you're a bit too picky?");
        setTargetId("");
      }
    });
  }, []);

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col s6'>
            <h3>{nameText}</h3>
          </div>
        </div>
        <div className='row'>
          <div className='col s12'>
            <p className='flow-text' style={{ overflowY: "scroll", minHeight: "50vh", maxHeight: "50vh" }}>
              {descriptionText}
            </p>
          </div>
        </div>
        <div className='row '>
          <div className='col s4 m3 l2 offset-s1 offset-m1 offset-l2'>
            <button
              onClick={() => {
                dislike(targetId, navigate);
                getUserToShow(navigate).then((newUser) => {
                  console.log(newUser);
                  if (newUser) {
                    setNameText(newUser.name);
                    setDescriptionText(newUser.description);
                    setTargetId(newUser.id);
                  } else {
                    setNameText("Sorry, couldn't find users to show you");
                    setDescriptionText("Perhaps you're a bit too picky?");
                    setTargetId("");
                  }
                });
              }}
            >
              <img className='responsive-img' src='/leftArrow.png' alt='dislike button' />
            </button>
          </div>
          <div className='col s4 m3 l2 offset-s2 offset-m4 offset-l4'>
            <button
              onClick={() => {
                like(targetId, navigate).then(() => {
                  getMatches(navigate).then((matches) => {
                    setMatchedUsers(matches);
                  });
                });
                setMatchedUsers([]); // this is to trigger a re render of the matched users list
                getUserToShow(navigate).then((newUser) => {
                  if (newUser) {
                    setNameText(newUser.name);
                    setDescriptionText(newUser.description);
                    setTargetId(newUser.id);
                  } else {
                    setNameText("Sorry, couldn't find users to show you");
                    setDescriptionText("Perhaps you're a bit too picky?");
                    setTargetId("");
                  }
                });
              }}
            >
              <img className='responsive-img' src='/rightArrow.png' alt='like button' />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SwipingView;
