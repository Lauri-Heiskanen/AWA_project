import { useState } from "react";

function SwipingView({ name, description }) {
  //login().then((data) => console.log(data));

  return (
    <>
      <div>
        <div>
          <h3>{name}</h3>
          <br />
          <p>{description}</p>
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
  console.log(localStorage);
  console.log("liked");
}

function dislikeButton() {
  console.log("disliked");
}

async function getUserToShow() {}

export default SwipingView;
