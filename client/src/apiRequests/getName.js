function getName(id) {
  return fetch("/api/user/name/" + id, {
    method: "get",
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default getName;
