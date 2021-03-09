const ws = require("../wslib");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

const schema = Joi.object({
  message: Joi.string().min(5).required(),
  author: Joi.string().pattern(
    new RegExp(
      "^[áéíóúñÁÉÍÓÚÑa-zA-Z]{3,}\\s[áéíóúñÁÉÍÓÚÑa-zA-Z]{3,}(\\s[áéíóúñÁÉÍÓÚÑa-zA-Z]{3,})*$"
    )
  ),
  ts: Joi.number(),
});

router.get("/", (req, res, next) => {
  res.send(ws.getMessages());
});

router.get("/:ts", (req, res, next) => {
  let json = ws.getMessages();

  let index = 0;
  let found = false;
  while (index < json.length && !found) {
    const element = json[index];
    if (element.ts == req.params.ts) {
      found = true;
      break;
    }
    index++;
  }
  if (found) {
    res.send(json[index]);
  } else {
    res.sendStatus(404);
  }
});

router.post("/", (req, res, next) => {
  let body = req.body;
  const { error } = schema.validate(body);
  console.log(error);
  if (!error && body.ts && Object.keys(body).length == 3) {
    ws.addMessages(body);
    ws.saveMessages();
    ws.sendMessages();
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.put("/:ts", (req, res, next) => {
  let body = req.body;
  const { error } = schema.validate(body);
  console.log(error);
  if (!error && Object.keys(body).length == 2) {
    ws.updateMessage(req.params.ts, body);
    ws.saveMessages();
    ws.sendMessages();
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

router.delete("/:ts", (req, res, next) => {
  let length = ws.getMessages().length;
  ws.replaceMessage(
    ws.getMessages().filter((value, index, arr) => value.ts != req.params.ts)
  );

  if (length !== ws.getMessages().length) {
    ws.saveMessages();
    ws.sendMessages();
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
