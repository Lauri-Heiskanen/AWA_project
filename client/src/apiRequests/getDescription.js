function getDescription(id, navigate) {
  return fetch("/api/user/description/" + id, {
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

export default getDescription;
