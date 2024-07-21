function getName(targetUserId, navigate) {
  return fetch("/api/chat/" + targetUserId, {
    method: "get",
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

export default getName;
