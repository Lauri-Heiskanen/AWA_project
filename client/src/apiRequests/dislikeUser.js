function dislike(id) {
  return fetch("/api/dislike", {
    method: "post",
    body: JSON.stringify({
      targetId: id,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default dislike;
