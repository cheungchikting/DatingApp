
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {firstname: 'Justin'},
        {firstname: 'Jack'},
        {firstname: 'Jane'},
        {firstname: 'Jason'},
        {firstname: 'John'},
        {firstname: 'Kim'},
        {firstname: 'Sally'},
        {firstname: 'Lesley'},
      ]);
    });
};
