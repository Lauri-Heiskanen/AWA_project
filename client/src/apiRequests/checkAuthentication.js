function checkAuthentication(token) {
  return fetch("/api/authenticated", {
    method: "get",
    headers: { Authorization: "Bearer " + token, "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.authenticated) {
        return true;
      } else {
        return false;
      }
    });
}

export default checkAuthentication;
