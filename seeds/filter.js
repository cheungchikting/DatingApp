
exports.seed = function(knex) {
  return knex('filter').del()
    .then(function () {
      return knex('filter').insert([
        {preferredGender: 'Female', preferredEthnicity: 'Asian', min_age: 23, max_age: 35, min_height: 150, max_height: 170, distance: 100, preferredEducation: 3, user_id: 1},
        {preferredGender: 'Female', preferredEthnicity: 'Asian', min_age: 23, max_age: 50, min_height: 150, max_height: 170, distance: 100, preferredEducation: 3, user_id: 2},
        {preferredGender: 'Male', preferredEthnicity: 'Asian', min_age: 19, max_age: 35, min_height: 170, max_height: 180, distance: 100, preferredEducation: 3, user_id: 3},
        {preferredGender: 'Male', preferredEthnicity: 'Asian', min_age: 25, max_age: 35, min_height: 170, max_height: 190, distance: 100, preferredEducation: 3, user_id: 4},
        {preferredGender: 'Female', preferredEthnicity: 'Asian', min_age: 23, max_age: 35, min_height: 150, max_height: 170, distance: 100, preferredEducation: 3, user_id: 5},
        {preferredGender: 'Female', preferredEthnicity: 'Asian', min_age: 23, max_age: 50, min_height: 150, max_height: 170, distance: 100, preferredEducation: 3, user_id: 6},
        {preferredGender: 'Male', preferredEthnicity: 'Asian', min_age: 19, max_age: 35, min_height: 170, max_height: 180, distance: 100, preferredEducation: 3, user_id: 7},
        {preferredGender: 'Male', preferredEthnicity: 'Asian', min_age: 25, max_age: 35, min_height: 170, max_height: 190, distance: 100, preferredEducation: 3, user_id: 8},
      ]);
    });
};
