function like(id) {
  return fetch("/api/like", {
    method: "post",
    body: JSON.stringify({
      targetId: id,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  });
}

export default like;
