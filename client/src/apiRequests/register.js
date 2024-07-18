function register(name, email, password, description) {
  return fetch("/api/register", {
    method: "post",
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      description: description,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default register;
