import { useEffect } from "react";
import checkAuthentication from "../apiRequests/checkAuthentication";
import getUserToShow from "../apiRequests/getUserToShow";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

function SwipingView() {
  const navigate = useNavigate();
  useEffect(() => {
    checkAuthentication(localStorage.getItem("token")).then((isAuthenticated) => {
      if (!isAuthenticated) {
        navigate("/login");
      }
    });
  });

  console.log(decodeToken(localStorage.getItem("token")));

  return (
    <>
      <div>
        <div>
          <h3>name</h3>
          <br />
          <p>description</p>
        </div>

        <button onClick={dislikeButton}>
          <img src='/leftArrow.png' width='64px' height='64px' alt='dislike button' />
        </button>
        <button onClick={likeButton}>
          <img src='/rightArrow.png' width='64px' height='64px' alt='like button' />
        </button>
      </div>
    </>
  );
}

function likeButton() {
  console.log("liked");
}

function dislikeButton() {
  console.log("disliked");
}

export default SwipingView;
