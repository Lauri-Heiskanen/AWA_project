function login(email, password, navigate) {
  return fetch("/api/login", {
    method: "post",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
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

export default login;
