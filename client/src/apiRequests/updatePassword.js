function updatePassword(password) {
  return fetch("/api/updatePassword", {
    method: "post",
    body: JSON.stringify({
      password: password,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default updatePassword;
