const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  console.log("render", data);
  const html = data
    .map(
      (item) =>
        `<p><b>Author:</b> ${item.author}</p>
      <p><b>Message:</b> ${item.message}</p>`
    )
    .join(" ");
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  let json = {
    message: message.value,
    author: author.value,
    ts: Date.now(),
  };

  ws.send(JSON.stringify(json));
  message.value = "";
  author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
