function login(email, password) {
  return fetch("/api/login", {
    method: "post",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default login;
