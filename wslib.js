const WebSocket = require("ws");
const fs = require("fs");

const clients = [];
let messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    loadMessages();
    sendMessages();

    ws.on("message", (message) => {
      messages.push(JSON.parse(message));
      sendMessages();
      saveMessages();
    });
  });
};

const saveMessages = () => {
  fs.writeFile("messageData.json", JSON.stringify(messages, null, 4), (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const loadMessages = () => {
  let data = fs.readFileSync("messageData.json");
  messages = JSON.parse(data);
};

const sendMessages = () => {
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

const addMessages = (message) => {
  messages.push(message);
};

const updateMessage = (ts, data) => {
  let index = 0;
  while (index < messages.length) {
    const element = messages[index];
    if (element.ts == ts) {
      element.message = data.message;
      element.author = data.author;
      break;
    }
    index++;
  }
};

const replaceMessage = (arr) => {
  messages = arr;
};

const getMessages = () => messages;

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
exports.getMessages = getMessages;
exports.loadMessages = loadMessages;
exports.addMessages = addMessages;
exports.saveMessages = saveMessages;
exports.updateMessage = updateMessage;
exports.replaceMessage = replaceMessage;
