function register(name, email, password, description, navigate) {
  return fetch("/api/register", {
    method: "post",
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      description: description,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) =>
    res.json().then((data) => {
      if (data.redirect) {
        navigate("/login");
      } else if (data.errorMessage) {
        return { success: false };
      } else {
        return data;
      }
    })
  );
}

export default register;
