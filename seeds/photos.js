exports.seed = function (knex) {
  return knex('photos').del()
    .then(function () {
      return knex('photos').insert([
        {pc1:"pic_foto1_1.jpg",pc2:"pic_foto1_2.jpg",pc3:"pic_foto1_3.jpg",pc4:"pic_foto1_4.jpg",pc5:"pic_foto1_5.jpg",pc6:"pic_foto1_6.jpg",user_id:1},
        {pc1:"pic_foto2_1.jpg",pc2:"pic_foto2_2.jpg",pc3:"pic_foto2_3.jpg",pc4:"pic_foto2_4.jpg",pc5:"pic_foto2_5.jpg",pc6:"pic_foto2_6.jpg",user_id:2},
        {pc1:"pic_foto3_1.jpg",pc2:"pic_foto3_2.jpg",pc3:"pic_foto3_3.jpg",pc4:"pic_foto3_4.jpg",pc5:"pic_foto3_5.jpg",pc6:"pic_foto3_6.jpg",user_id:3},
        {pc1:"pic_foto4_1.jpg",pc2:"pic_foto4_2.jpg",pc3:"pic_foto4_3.jpg",pc4:"pic_foto4_4.jpg",pc5:"pic_foto4_5.jpg",pc6:"pic_foto4_6.jpg",user_id:4},
        {pc1:"pic_foto5_1.jpg",pc2:"pic_foto5_2.jpg",pc3:"pic_foto5_3.jpg",pc4:"pic_foto5_4.jpg",pc5:"pic_foto5_5.jpg",pc6:"pic_foto5_6.jpg",user_id:5},
        {pc1:"pic_foto6_1.jpg",pc2:"pic_foto6_2.jpg",pc3:"pic_foto6_3.jpg",pc4:"pic_foto6_4.jpg",pc5:"pic_foto6_5.jpg",pc6:"pic_foto6_6.jpg",user_id:6},
        {pc1:"pic_foto7_1.jpg",pc2:"pic_foto7_2.jpg",pc3:"pic_foto7_3.jpg",pc4:"pic_foto7_4.jpg",pc5:"pic_foto7_5.jpg",pc6:"pic_foto7_6.jpg",user_id:7},
        {pc1:"pic_foto8_1.jpg",pc2:"pic_foto8_2.jpg",pc3:"pic_foto8_3.jpg",pc4:"pic_foto8_4.jpg",pc5:"pic_foto8_5.jpg",pc6:"pic_foto8_6.jpg",user_id:8},
        {pc1:"pic_foto9_1.jpg",pc2:"pic_foto9_2.jpg",pc3:"pic_foto9_3.jpg",pc4:"pic_foto9_4.jpg",pc5:"pic_foto9_5.jpg",pc6:"pic_foto9_6.jpg",user_id:9},
        {pc1:"pic_foto10_1.jpg",pc2:"pic_foto10_2.jpg",pc3:"pic_foto10_3.jpg",pc4:"pic_foto10_4.jpg",pc5:"pic_foto10_5.jpg",pc6:"pic_foto10_6.jpg",user_id:10},
        {pc1:"pic_foto11_1.jpg",pc2:"pic_foto11_2.jpg",pc3:"pic_foto11_3.jpg",pc4:"pic_foto11_4.jpg",pc5:"pic_foto11_5.jpg",pc6:"pic_foto11_6.jpg",user_id:11},
        {pc1:"pic_foto12_1.jpg",pc2:"pic_foto12_2.jpg",pc3:"pic_foto12_3.jpg",pc4:"pic_foto12_4.jpg",pc5:"pic_foto12_5.jpg",pc6:"pic_foto12_6.jpg",user_id:12},
        {pc1:"pic_foto13_1.jpg",pc2:"pic_foto13_2.jpg",pc3:"pic_foto13_3.jpg",pc4:"pic_foto13_4.jpg",pc5:"pic_foto13_5.jpg",pc6:"pic_foto13_6.jpg",user_id:13},
        {pc1:"pic_foto14_1.jpg",pc2:"pic_foto14_2.jpg",pc3:"pic_foto14_3.jpg",pc4:"pic_foto14_4.jpg",pc5:"pic_foto14_5.jpg",pc6:"pic_foto14_6.jpg",user_id:14},
        {pc1:"pic_foto15_1.jpg",pc2:"pic_foto15_2.jpg",pc3:"pic_foto15_3.jpg",pc4:"pic_foto15_4.jpg",pc5:"pic_foto15_5.jpg",pc6:"pic_foto15_6.jpg",user_id:15},
        {pc1:"pic_foto16_1.jpg",pc2:"pic_foto16_2.jpg",pc3:"pic_foto16_3.jpg",pc4:"pic_foto16_4.jpg",pc5:"pic_foto16_5.jpg",pc6:"pic_foto16_6.jpg",user_id:16},
        {pc1:"pic_foto17_1.jpg",pc2:"pic_foto17_2.jpg",pc3:"pic_foto17_3.jpg",pc4:"pic_foto17_4.jpg",pc5:"pic_foto17_5.jpg",pc6:"pic_foto17_6.jpg",user_id:17},
        {pc1:"pic_foto18_1.jpg",pc2:"pic_foto18_2.jpg",pc3:"pic_foto18_3.jpg",pc4:"pic_foto18_4.jpg",pc5:"pic_foto18_5.jpg",pc6:"pic_foto18_6.jpg",user_id:18},
        {pc1:"pic_foto19_1.jpg",pc2:"pic_foto19_2.jpg",pc3:"pic_foto19_3.jpg",pc4:"pic_foto19_4.jpg",pc5:"pic_foto19_5.jpg",pc6:"pic_foto19_6.jpg",user_id:19},
        {pc1:"pic_foto20_1.jpg",pc2:"pic_foto20_2.jpg",pc3:"pic_foto20_3.jpg",pc4:"pic_foto20_4.jpg",pc5:"pic_foto20_5.jpg",pc6:"pic_foto20_6.jpg",user_id:20},
        {pc1:"pic_foto21_1.jpg",pc2:"pic_foto21_2.jpg",pc3:"pic_foto21_3.jpg",pc4:"pic_foto21_4.jpg",pc5:"pic_foto21_5.jpg",pc6:"pic_foto21_6.jpg",user_id:21},
        {pc1:"pic_foto22_1.jpg",pc2:"pic_foto22_2.jpg",pc3:"pic_foto22_3.jpg",pc4:"pic_foto22_4.jpg",pc5:"pic_foto22_5.jpg",pc6:"pic_foto22_6.jpg",user_id:22},
        {pc1:"pic_foto23_1.jpg",pc2:"pic_foto23_2.jpg",pc3:"pic_foto23_3.jpg",pc4:"pic_foto23_4.jpg",pc5:"pic_foto23_5.jpg",pc6:"pic_foto23_6.jpg",user_id:23},
        {pc1:"pic_foto24_1.jpg",pc2:"pic_foto24_2.jpg",pc3:"pic_foto24_3.jpg",pc4:"pic_foto24_4.jpg",pc5:"pic_foto24_5.jpg",pc6:"pic_foto24_6.jpg",user_id:24},
        {pc1:"pic_foto25_1.jpg",pc2:"pic_foto25_2.jpg",pc3:"pic_foto25_3.jpg",pc4:"pic_foto25_4.jpg",pc5:"pic_foto25_5.jpg",pc6:"pic_foto25_6.jpg",user_id:25},
        {pc1:"pic_foto26_1.jpg",pc2:"pic_foto26_2.jpg",pc3:"pic_foto26_3.jpg",pc4:"pic_foto26_4.jpg",pc5:"pic_foto26_5.jpg",pc6:"pic_foto26_6.jpg",user_id:26}
      ])
    })
  }