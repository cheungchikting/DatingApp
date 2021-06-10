exports.seed = function (knex) {
  return knex('chatroom').del()
  };