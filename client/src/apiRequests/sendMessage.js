function sendMessage(id, text, navigate) {
  return fetch("/api/message", {
    method: "post",
    body: JSON.stringify({
      chatId: id,
      text: text,
    }),
    headers: { Authorization: "Bearer " + localStorage.getItem("token"), "Content-type": "application/json; charset=UTF-8" },
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

export default sendMessage;
