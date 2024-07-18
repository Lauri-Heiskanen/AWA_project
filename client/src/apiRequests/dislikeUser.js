function dislike(id) {
  return fetch("/api/dislike", {
    method: "post",
    body: JSON.stringify({
      targetId: id,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  });
}

export default dislike;
