require('dotenv').config();
const next = require('next');
const keystone = require('keystone');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: './views', dev });

keystone.init({
  'wysiwyg images': true, // 插入url图片
  // 'wysiwyg cloudinary images': true, //上传cloud
  'wysiwyg additional plugins': 'uploadimage',
  'wysiwyg additional buttons': 'uploadimage',
  'wysiwyg additional options': {
    uploadimage_form_url: '/api/admin/upload-image', // 上传图片的API
    relative_urls: false,
    external_plugins: { uploadimage: '/js/uploadimage/plugin.min.js' }, // 上传图片插件
  },
  name: 'cms-ssr',
  static: 'static',
  brand: 'cms-ssr',
  'auto update': true,
  mongo: dev
    ? 'mongodb://localhost:27017/cms-ssr'
    : 'mongodb://root:admin@localhost/cms-ssr',
  session: true,
  auth: true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'cms-ssr-secret',
});

keystone.import('models');

app.prepare().then(() => {
  if (!dev) {
    app.setAssetPrefix('//static...');
  }
  keystone.set('routes', require('./routes')(app));
  keystone.set('nav', {
    posts: ['posts', 'post-categories'],
    users: 'users',
  });
  keystone.start();
});

// db.createUser({
//   user: 'user',
//   pwd: '123456',
//   roles: [
//     { role: 'readWrite', db: 'cms-ssr' },
//     { role: 'dbOwner', db: 'cms-ssr' },
//     { role: 'dbAdmin', db: 'cms-ssr' },
//   ],
// });
