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
    getUserToShow()
      .then((newUser) => {
        if (newUser) {
          setNameText(newUser.name);
          setDescriptionText(newUser.description);
          setTargetId(newUser.id);
        }
      })
      .catch(() => {
        setNameText("Matti");
        setDescriptionText(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non viverra tortor, at vehicula neque. Sed nec pulvinar nunc. Phasellus pretium magna eget massa semper porta. Nam vestibulum neque a erat vestibulum, non molestie justo elementum. Curabitur efficitur non mauris vitae venenatis. Pellentesque mollis diam at dui efficitur, et mollis velit convallis. Fusce ullamcorper pulvinar quam, vel ornare mi varius ac. Maecenas quis consequat lorem. Phasellus in leo ultrices, auctor mi et, laoreet ex. Vestibulum id eros ultricies, vestibulum neque a, blandit risus. Suspendisse a turpis porttitor, tincidunt ligula id, fringilla tortor. Pellentesque mollis placerat tempor. Aenean blandit posuere condimentum. Fusce placerat vestibulum ultricies. Cras pellentesque et odio id pulvinar. Nulla finibus odio arcu, vitae ultrices urna euismod nec. Nunc sollicitudin hendrerit turpis ac bibendum. Morbi vitae lorem molestie nunc lacinia ullamcorper. Vivamus elementum dui vel vehicula consectetur. Vestibulum non turpis et eros dapibus rutrum. Fusce iaculis justo et laoreet ultricies. Pellentesque semper odio sem, id gravida nisi scelerisque sit amet. Duis accumsan fermentum mauris et vulputate. Integer cursus finibus lorem id congue."
        );
        setTargetId("");
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
