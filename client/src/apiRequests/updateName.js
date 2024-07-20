function updateName(name, email, password, description, navigate) {
  return fetch("/api/updateName", {
    method: "post",
    body: JSON.stringify({
      name: name,
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

export default updateName;