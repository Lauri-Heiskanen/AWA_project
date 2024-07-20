function updateEmail(email, navigate) {
  return fetch("/api/updateEmail", {
    method: "post",
    body: JSON.stringify({
      email: email,
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

export default updateEmail;
