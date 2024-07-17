function getUserToShow() {
  return fetch("/api/getUserToShow", {
    method: "get",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then((res) => res.json());
}

export default getUserToShow;
