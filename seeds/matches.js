
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('matches').del()
    .then(function () {
      // Inserts seed entries
      return knex('matches').insert([
        {like: JSON.stringify([2]), dislike: JSON.stringify([3,4]), user_id: 1},
        {like: JSON.stringify([1,3]), dislike: JSON.stringify([4]), user_id: 2},
        {like: JSON.stringify([1,2]), dislike: JSON.stringify([4]), user_id: 3},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 4},
        {like: JSON.stringify([2]), dislike: JSON.stringify([3,4]), user_id: 5},
        {like: JSON.stringify([1,3]), dislike: JSON.stringify([4]), user_id: 6},
        {like: JSON.stringify([1,2]), dislike: JSON.stringify([4]), user_id: 7},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 8},
      ]);
    });
};
