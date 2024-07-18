function updateDescription(description) {
  return fetch("/api/updateDescription", {
    method: "post",
    body: JSON.stringify({
      description: description,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default updateDescription;
