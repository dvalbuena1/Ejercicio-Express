const ws = require("../wslib");
const express = require("express");
const Joi = require("joi");
const mc = require("../controller/message");
const { response } = require("express");
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
  mc.getAll((data) => {
    res.send(data);
  });
});

router.get("/:ts", (req, res, next) => {
  mc.getById(req.params.ts, (response) => {
    if (response === null) {
      res.sendStatus(404);
    } else {
      res.send(response);
    }
  });
});

router.post("/", (req, res, next) => {
  let body = req.body;
  const { error } = schema.validate(body);

  if (!error && body.ts && Object.keys(body).length == 3) {
    mc.getById(body.ts, (found) => {
      if (found === null) {
        mc.post(body, (response) => {
          res.send(response);
          mc.getAll((data) => {
            ws.replaceMessage(data);
            ws.sendMessages();
          });
        });
      } else {
        res.status(400).send("ts already in use");
      }
    });
  } else {
    res.status(400).send(error);
  }
});

router.put("/:ts", (req, res, next) => {
  let body = req.body;
  const { error } = schema.validate(body);
  if (!error && Object.keys(body).length == 2) {
    mc.put(req.params.ts, body, (response) => {
      if (response[0] !== 0) {
        res.send(200);
        mc.getAll((data) => {
          ws.replaceMessage(data);
          ws.sendMessages();
        });
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.status(400).send(error);
  }
});

router.delete("/:ts", (req, res, next) => {
  mc.remove(req.params.ts, (response) => {
    if (response === 1) {
      res.sendStatus(204);
      mc.getAll((data) => {
        ws.replaceMessage(data);
        ws.sendMessages();
      });
    } else {
      res.sendStatus(404);
    }
  });
});

module.exports = router;
