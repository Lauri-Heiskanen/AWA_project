function getMatches(navigate) {
  return fetch("/api/matches/", {
    method: "get",
    credentials: "include",
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

export default getMatches;
