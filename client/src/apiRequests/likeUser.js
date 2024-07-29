function like(targetId, navigate) {
  return fetch("/api/like", {
    method: "post",
    body: JSON.stringify({ targetId: targetId }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) =>
    res.json().then((data) => {
      if (data.redirect) {
        navigate("/login");
      } else if (!data.errorMessage) {
        return data;
      }
    })
  );
}

export default like;
