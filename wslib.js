const WebSocket = require("ws");
const fs = require("fs");
const mc = require("./controller/message");

const clients = [];
let messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    mc.getAll((data) => {
      replaceMessage(data);
      sendMessages();
    });

    ws.on("message", (message) => {
      mc.post(JSON.parse(message), (response) => {
        mc.getAll((data) => {
          messages = data;
          sendMessages();
        });
      });
    });
  });
};

const loadMessages = () => {
  mc.getAll((data) => {
    messages = data;
  });
};

const sendMessages = () => {
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

const replaceMessage = (arr) => {
  messages = arr;
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
exports.loadMessages = loadMessages;
exports.replaceMessage = replaceMessage;
