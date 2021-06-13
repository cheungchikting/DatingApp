
exports.seed = function(knex) {
  return knex('filter').del()
};
