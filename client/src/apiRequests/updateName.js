function updateName(name, email, password, description) {
  return fetch("/api/updateName", {
    method: "post",
    body: JSON.stringify({
      name: name,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  });
}

export default updateName;
