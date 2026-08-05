const axios = require('axios');
const name = 'Avika Bhargava'; 
const domain = 'Product Management'; 
const date = 'February 1st 2026 to August 1st 2026'; 
const uid = 'KR-83921'; 
const id = '66f0a1b2c3d4e5f6a7b8c9d0'; 
const url = `https://res.cloudinary.com/do5gatqvs/image/upload/co_rgb:000000,l_text:times%20new%20roman_65_bold_normal_left:${encodeURIComponent(name)}/fl_layer_apply,y_-50/co_rgb:000000,l_text:times%20new%20roman_30_bold_normal_left:${encodeURIComponent(date)}/fl_layer_apply,y_-220/co_rgb:000000,l_text:times%20new%20roman_33_bold_normal_left:${encodeURIComponent(domain)}/fl_layer_apply,g_west,x_712,y_193/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(uid)}/fl_layer_apply,g_south_west,x_465,y_28/co_rgb:000000,l_text:times%20new%20roman_18_normal_left:${encodeURIComponent(id)}/fl_layer_apply,g_south_west,x_900,y_28/adobe_ovkftr`;
console.log(url);
axios.get(url).then(res => console.log('SUCCESS!')).catch(err => console.log(err.response.headers['x-cld-error']));
