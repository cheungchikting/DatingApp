
exports.seed = function(knex) {
  return knex('coins').del()
};
