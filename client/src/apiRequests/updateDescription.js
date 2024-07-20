function updateDescription(description, navigate) {
  return fetch("/api/updateDescription", {
    method: "post",
    body: JSON.stringify({
      description: description,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
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

export default updateDescription;
