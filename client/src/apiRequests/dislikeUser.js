function dislike(targetId, navigate) {
  return fetch("/api/dislike", {
    method: "post",
    body: JSON.stringify({ targetId: targetId }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) =>
    res.json().then((data) => {
      console.log(data);
      if (data.redirect) {
        navigate("/login");
      } else if (!data.errorMessage) {
        return data;
      }
    })
  );
}

export default dislike;
