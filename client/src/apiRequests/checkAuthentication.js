function checkAuthentication() {
  return fetch("/api/authenticated", {
    method: "get",
    headers: { "Content-type": "application/json; charset=UTF-8" },
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
