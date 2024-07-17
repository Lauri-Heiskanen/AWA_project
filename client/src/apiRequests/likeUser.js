function like(email, password) {
  return fetch("/api/like", {
    method: "post",
    body: JSON.stringify({
      targetId: id,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default like;
