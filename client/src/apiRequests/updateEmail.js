function updateEmail(email) {
  return fetch("/api/updateEmail", {
    method: "post",
    body: JSON.stringify({
      email: email,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  });
}

export default updateEmail;
