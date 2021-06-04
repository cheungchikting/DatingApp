exports.seed = function (knex) {
  return knex('usersProfile').del()
    .then(function () {
      return knex('usersProfile').insert([{
        gender: 'Male',
        birthday: new Date('01/01/1988'),
        height: 180,
        ethnicity: 'Asian',
        work: "Finance",
        education: 3,
        religion: "christian",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "1"
      }, {
        gender: 'Male',
        birthday: new Date('01/01/2001'),
        height: 170,
        ethnicity: 'Asian',
        work: "IT",
        education: 2,
        religion: "christian",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "2"
      }, {
        gender: 'Female',
        birthday: new Date('01/01/1980'),
        height: 160,
        ethnicity: 'Asian',
        work: "Education",
        education: 3,
        religion: "Buddish",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "3"
      }, {
        gender: 'Female',
        birthday: new Date('01/01/1997'),
        height: 150,
        ethnicity: 'Asian',
        work: "F&B",
        education: 5,
        religion: "christian",
        location: JSON.stringify({
          latitude: 35.689487,
          longitude: 139.691711,
      }),
        aboutme: "I am good",
        user_id: "4"
      }, {
        gender: 'Male',
        birthday: new Date('01/01/1988'),
        height: 180,
        ethnicity: 'Asian',
        work: "Finance",
        education: 3,
        religion: "christian",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "5"
      }, {
        gender: 'Male',
        birthday: new Date('01/01/2001'),
        height: 170,
        ethnicity: 'Asian',
        work: "IT",
        education: 2,
        religion: "christian",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "6"
      }, {
        gender: 'Female',
        birthday: new Date('01/01/1980'),
        height: 160,
        ethnicity: 'Asian',
        work: "Education",
        education: 3,
        religion: "Buddish",
        location: JSON.stringify({
          latitude: 22.396427,
          longitude: 114.109497,
      }),
        aboutme: "I am good",
        user_id: "7"
      }, {
        gender: 'Female',
        birthday: new Date('01/01/1997'),
        height: 150,
        ethnicity: 'Asian',
        work: "F&B",
        education: 5,
        religion: "christian",
        location: JSON.stringify({
          latitude: 35.689487,
          longitude: 139.691711,
      }),
        aboutme: "I am good",
        user_id: "8"
      }]);
    });
};