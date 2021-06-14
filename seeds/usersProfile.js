exports.seed = function (knex) {
  let text = `I am a person who is positive about every aspect of life. There are many things I like to do, to see, and to experience. I like to read, I like to write; I like to think, I like to dream; I like to talk, I like to listen. I like to see the sunrise in the morning, I like to see the moonlight at night; I like to feel the music flowing on my face, I like to smell the wind coming from the ocean. I like to look at the clouds in the sky with a blank mind, I like to do thought experiment when I cannot sleep in the middle of the night. I like flowers in spring, rain in summer, leaves in autumn, and snow in winter. I like to sleep early, I like to get up late; I like to be alone, I like to be surrounded by people. I like country’s peace, I like metropolis’ noise; I like the beautiful west lake in Hangzhou, I like the flat cornfield in Champaign. I like delicious food and comfortable shoes; I like good books and romantic movies. I like the land and the nature, I like people. And, I like to laugh.
  I always wanted to be a great writer, like Victor Hugo who wrote "Les Miserable", or like Roman Roland who wrote "John Christopher".`


  return knex('usersProfile').del()
    .then(function () {
      return knex('usersProfile').insert([
        {profilepic:"pic_pficon1.jpg",gender:"Female",birthday:"07/29/1986",height:173,work:"Food Chemist",education:5,ethnicity:"Asian",religion:"Buddhist",hometown:"Tanjungagung",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 1},
        {profilepic:"pic_pficon2.jpg",gender:"Female",birthday:"09/05/1983",height:150,work:"Internal Auditor",education:2,ethnicity:"Asian",religion:"Buddhist",hometown:"Shikhany",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 2},
        {profilepic:"pic_pficon3.jpg",gender:"Female",birthday:"03/26/1984",height:171,work:"Associate Professor",education:4,ethnicity:"Asian",religion:"Christian",hometown:"Mosquée",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 3},
        {profilepic:"pic_pficon4.jpg",gender:"Female",birthday:"04/29/1983",height:152,work:"Staff Scientist",education:5,ethnicity:"Asian",religion:"Christian",hometown:"Fazenda de Santa Cruz",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 4},
        {profilepic:"pic_pficon5.jpg",gender:"Female",birthday:"10/16/1988",height:162,work:"Dental Hygienist",education:2,ethnicity:"Asian",religion:"Christian",hometown:"Atafu Village",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 5},
        {profilepic:"pic_pficon6.jpg",gender:"Female",birthday:"05/09/1992",height:182,work:"Research Associate",education:4,ethnicity:"Asian",religion:"Christian",hometown:"Kuty",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 6},
        {profilepic:"pic_pficon7.jpg",gender:"Female",birthday:"04/26/1991",height:166,work:"Legal Assistant",education:1,ethnicity:"Asian",religion:"Christian",hometown:"Pandean",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 7},
        {profilepic:"pic_pficon8.jpg",gender:"Female",birthday:"08/04/1997",height:172,work:"Chief Design Engineer",education:2,ethnicity:"Asian",religion:"Christian",hometown:"Chittagong",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 8},
        {profilepic:"pic_pficon9.jpg",gender:"Female",birthday:"03/01/1991",height:171,work:"Assistant Professor",education:4,ethnicity:"Asian",religion:"Christian",hometown:"Bom Sucesso",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 9},
        {profilepic:"pic_pficon10.jpg",gender:"Female",birthday:"01/11/1989",height:163,work:"Administrative Officer",education:4,ethnicity:"Asian",religion:"Buddhist",hometown:"Buluh Kasap",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 10},
        {profilepic:"pic_pficon11.jpg",gender:"Female",birthday:"02/03/1996",height:187,work:"Human Resources Manager",education:5,ethnicity:"Asian",religion:"Buddhist",hometown:"Lérida",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 11},
        {profilepic:"pic_pficon12.jpg",gender:"Female",birthday:"05/07/1990",height:170,work:"Staff Accountant IV",education:1,ethnicity:"Asian",religion:"Buddhist",hometown:"Ribeirão da Ilha",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 12},
        {profilepic:"pic_pficon13.jpg",gender:"Female",birthday:"11/20/1996",height:159,work:"Statistician II",education:2,ethnicity:"Asian",religion:"Christian",hometown:"Huji",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 13},
        {profilepic:"pic_pficon14.jpg",gender:"Female",birthday:"03/24/1990",height:170,work:"GIS Technical Architect",education:1,ethnicity:"Asian",religion:"Buddhist",hometown:"Luleå",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 14},
        {profilepic:"pic_pficon15.jpg",gender:"Female",birthday:"10/10/1991",height:190,work:"Occupational Therapist",education:3,ethnicity:"Asian",religion:"Buddhist",hometown:"Souto da Costa",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 15},
        {profilepic:"pic_pficon16.jpg",gender:"Female",birthday:"04/01/1994",height:177,work:"Junior Executive",education:3,ethnicity:"Asian",religion:"Buddhist",hometown:"Girang",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 16},
        {profilepic:"pic_pficon17.jpg",gender:"Female",birthday:"04/29/1988",height:176,work:"Chief Design Engineer",education:3,ethnicity:"Asian",religion:"Buddhist",hometown:"Xingong",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 17},
        {profilepic:"pic_pficon18.jpg",gender:"Female",birthday:"11/04/1995",height:174,work:"VP Marketing",education:3,ethnicity:"Asian",religion:"Christian",hometown:"Tver",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme: text,user_id: 18},
        {profilepic:"pic_pficon19.jpg",gender:"Female",birthday:"07/19/1992",height:165,work:"VP Sales",education:3,ethnicity:"Asian",religion:"Christian",hometown:"Cocorná",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 19},
        {profilepic:"pic_pficon20.jpg",gender:"Female",birthday:"01/16/1983",height:159,work:"Statistician II",education:1,ethnicity:"Asian",religion:"Christian",hometown:"Shiye",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 20},
        {profilepic:"pic_pficon21.jpg",gender:"Female",birthday:"6/13/1998",height:170,work:"Cost Accountant",education:2,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Mogi Guaçu",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 21},
        {profilepic:"pic_pficon22.jpg",gender:"Female",birthday:"12/13/1995",height:161,work:"VP Marketing",education:3,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Eindhoven",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 22},
        {profilepic:"pic_pficon23.jpg",gender:"Female",birthday:"8/11/1991",height:155,work:"Budget/Accounting Analyst IV",education:2,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Kerċem",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 23},
        {profilepic:"pic_pficon24.jpg",gender:"Female",birthday:"1/30/1997",height:172,work:"Junior Executive",education:2,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Shajing",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 24},
        {profilepic:"pic_pficon25.jpg",gender:"Female",birthday:"6/19/1982",height:177,work:"Software Test Engineer IV",education:3,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Nguékhokh",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 25},
        {profilepic:"pic_pficon26.jpg",gender:"Female",birthday:"7/14/1996",height:170,work:"VP Sales",education:5,ethnicity:"Asian",religion:"Spiritual but not religious",hometown:"Salon-de-Provence",location:{"latitude": 22.2962464,"longitude":114.1796055},aboutme:text,user_id: 26}
      ]);
    });
  };