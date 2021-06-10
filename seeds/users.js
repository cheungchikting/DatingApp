
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {firstname:"Vivia",lastname:"Ceyssen",email:"vceyssen0@wix.com",phone:"278 280 9663"},
        {firstname:"Temp",lastname:"Wagstaffe",email:"twagstaffe1@4shared.com",phone:"508 703 9559"},
        {firstname:"Caryl",lastname:"Coultass",email:"ccoultass2@prnewswire.com",phone:"313 400 7018"},
        {firstname:"Gar",lastname:"Coslett",email:"gcoslett3@timesonline.co.uk",phone:"259 245 2201"},
        {firstname:"Sascha",lastname:"Melsom",email:"smelsom4@dropbox.com",phone:"488 353 4283"},
        {firstname:"Fredric",lastname:"Dimeloe",email:"fdimeloe5@redcross.org",phone:"955 985 8834"},
        {firstname:"Vanessa",lastname:"Broske",email:"vbroske6@npr.org",phone:"610 419 7249"},
        {firstname:"Scarlett",lastname:"Chettle",email:"schettle7@multiply.com",phone:"350 194 7123"},
        {firstname:"Virginia",lastname:"Toffetto",email:"vtoffetto8@tripadvisor.com",phone:"149 677 7835"},
        {firstname:"Gillan",lastname:"Sall",email:"gsall9@lulu.com",phone:"833 667 8971"},
        {firstname:"Randi",lastname:"Caller",email:"rcallera@bbb.org",phone:"808 640 9294"},
        {firstname:"Junina",lastname:"Arboine",email:"jarboineb@wsj.com",phone:"653 346 3888"},
        {firstname:"Christalle",lastname:"Jerche",email:"cjerchec@nydailynews.com",phone:"650 453 0408"},
        {firstname:"Rufus",lastname:"Baudone",email:"rbaudoned@cbslocal.com",phone:"784 987 5414"},
        {firstname:"Leshia",lastname:"Bircher",email:"lbirchere@wix.com",phone:"796 719 5159"},
        {firstname:"Jemie",lastname:"Benning",email:"jbenningf@mit.edu",phone:"734 338 2189"},
        {firstname:"Gaylord",lastname:"Gladden",email:"ggladdeng@over-blog.com",phone:"651 423 0897"},
        {firstname:"Kaye",lastname:"Thalmann",email:"kthalmannh@vkontakte.ru",phone:"422 142 0759"},
        {firstname:"Robinett",lastname:"Leah",email:"rleahi@berkeley.edu",phone:"177 472 7573"},
        {firstname:"Rhody",lastname:"Pibworth",email:"rpibworthj@xinhuanet.com",phone:"258 853 2033"},
        {firstname:"Mab",lastname:"Gillebert",email:"mgillebert0@yellowpages.com",phone:"711 873 1500"},
        {firstname:"Belinda",lastname:"Stokoe",email:"bstokoe1@spotify.com",phone:"881 364 8942"},
        {firstname:"Heriberto",lastname:"Tarpey",email:"htarpey2@51.la",phone:"411 344 5352"},
        {firstname:"Mallorie",lastname:"Kattenhorn",email:"mkattenhorn3@google.cn",phone:"980 116 7333"},
        {firstname:"Lil",lastname:"Serjeantson",email:"lserjeantson4@bloomberg.com",phone:"263 922 2724"},
        {firstname:"Berkley",lastname:"Shackle",email:"bshackle5@edublogs.org",phone:"124 788 9477"}
      ]);
    });
};
