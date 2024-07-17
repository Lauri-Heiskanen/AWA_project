function getUser() {
  return fetch("/api/user", {
    method: "get",
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default getUser;
