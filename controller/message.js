const Message = require("../models/message");

const getAll = async (callback) => {
  let a = await Message.findAll();
  callback(a);
};
const getById = async (id, callback) => {
  let a = await Message.findByPk(id);
  callback(a);
};
const post = async (body, callback) => {
  let a = await Message.create(body);
  callback(a);
};
const put = async (id, body, callback) => {
  let a = await Message.update(body, { where: { ts: id } });
  callback(a);
};
const remove = async (id, callback) => {
  let a = await Message.destroy({ where: { ts: id } });
  callback(a);
};

module.exports = {
  getAll: getAll,
  getById: getById,
  post: post,
  put: put,
  remove: remove,
};
