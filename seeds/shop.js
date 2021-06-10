
exports.seed = function(knex) {

  return knex('shop').del()
    .then(function () {
      return knex('shop').insert([
        {token: 'likeme', price: 300},
        {token: 'viewmore', price: 100},

      ]);
    });
};
