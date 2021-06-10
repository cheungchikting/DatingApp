
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('matches').del()
    .then(function () {
      // Inserts seed entries
      return knex('matches').insert([
        {like: JSON.stringify([27]), dislike: JSON.stringify([3,4]), user_id: 1},
        {like: JSON.stringify([27]), dislike: JSON.stringify([4]), user_id: 2},
        {like: JSON.stringify([1,2]), dislike: JSON.stringify([4]), user_id: 3},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 4},
        {like: JSON.stringify([2]), dislike: JSON.stringify([3,4]), user_id: 5},
        {like: JSON.stringify([1,3]), dislike: JSON.stringify([4]), user_id: 6},
        {like: JSON.stringify([1,2]), dislike: JSON.stringify([4]), user_id: 7},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 8},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 9},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 10},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 11},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 12},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 13},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 14},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 15},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 16},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 17},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 18},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 19},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 20},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 21},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 22},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 23},
        {like: JSON.stringify([2,3]), dislike: JSON.stringify([1]), user_id: 17},
      ]);
    });
};
