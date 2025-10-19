import emailjs from '@emailjs/browser';
// src/lib/sendNewsletterEmail.js


const SERVICE_ID = 'service_xj2twkz';
const TEMPLATE_ID = 'template_9t66uat';
const PUBLIC_KEY  = 'oP62zfxQ2zGZKjVSU';

emailjs.init(PUBLIC_KEY);

export async function sendNewsletterEmail(email) {
  if (!email) throw new Error('Email trống');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) throw new Error('Email không hợp lệ');

  const templateParams = {
    // Bạn đang cấu hình To = {{to_email}} → gửi cả 2 khóa cho chắc
    user_email: email,
    to_email: email,
    user_name: email.split('@')[0],

    // Nội dung template
    store_name: 'UNITSUKA TIGER',
    website_url: 'https://shop.example.com',
    logo_url:
      'https://cdn.discordapp.com/attachments/714835186575212635/1405012841118961675/ChatGPT_Image_09_19_27_13_thg_8_2025.png?ex=689d47ad&is=689bf62d&hm=85a599ac6aa0f430ba97df539d6c7b7e15b23cb1043af8871bae2d7d276f5460&',
    hero_image_url:
      'https://cdn.discordapp.com/attachments/714835186575212635/1405014967396077709/ChatGPT_Image_09_27_50_13_thg_8_2025.png?ex=689d49a8&is=689bf828&hm=efabc4d29c03be2021391e4619bea57cd72b10535c1d9536cdf9173215334040&',
    feature1_image_url:
      'https://media.istockphoto.com/id/1129866093/vi/anh/ch%E1%BA%A1y-xuy%C3%AAn-qu%E1%BB%91c-gia-v%C3%A0o-s%C3%A3ng-s%E1%BB%9Bm.jpg?s=612x612&w=0&k=20&c=B6zlZPYQTieIUP_2SzWJUALd92o9madWX0ntiw3bgwI=',
    feature2_image_url:
      'https://down-vn.img.susercontent.com/file/sg-11134201-7rdwg-mcvkv938t4y6e5.webp',
    feature3_image_url:
      'https://file.hstatic.net/200000472237/file/kinh-doanh-phu-kien-thoi-trang_af0ca3c1d96348c1acadee1c0ff98931_grande.png',

    facebook_url: 'https://shop.example.com/social/facebook',
    instagram_url: 'https://shop.example.com/social/instagram',
    tiktok_url: 'https://shop.example.com/social/tiktok',
    facebook_icon_url:
      'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
    instagram_icon_url:
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
    tiktok_icon_url:
      'https://upload.wikimedia.org/wikipedia/en/0/0a/TikTok_logo.svg',

    company_address: 'Hoa Lac, Thach That, Ha Noi, Viet Nam',
    company_phone: '0909 090 909',
    unsubscribe_url: 'https://shop.example.com/unsubscribe',
    webview_url: 'https://shop.example.com/email/webview/welcome',
    year: new Date().getFullYear().toString()
  };

  // có thể: return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
}
