const keystone = require('keystone');
const { parse } = require('url');
// const middleware = require('./middleware');

const importRoutes = keystone.importer(__dirname);

// keystone.pre('static', middleware.validateIp);

const api = importRoutes('./api');

exports = module.exports = nextApp => (keystoneApp) => {
  // api
  keystoneApp.get('/api/news', api.news);
  keystoneApp.get('/api/post', api.post);
  keystoneApp.post('/api/admin/upload-image', keystone.middleware.api, api.uploadImage);

  // view
  const handle = nextApp.getRequestHandler();
  keystoneApp.get('/post/:id', (req, res) => {
    nextApp.render(req, res, '/post', { id: req.params.id });
  });
  keystoneApp.get('/m/post/:id', (req, res) => {
    nextApp.render(req, res, '/m/post', { id: req.params.id });
  });
  keystoneApp.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);

    const { pathname, query } = parsedUrl;
    const ua = req.headers['user-agent'];

    if (/Mobile/i.test(ua) && pathname.indexOf('/m') === -1) {
      const mobilePathname = pathname === '/' ? '/m' : `/m${pathname}`;
      nextApp.render(req, res, mobilePathname, query);
    } else if (!/Mobile/i.test(ua) && pathname.indexOf('/m/') > -1) {
      nextApp.render(req, res, pathname.slice(2), query);
    } else if (!/Mobile/i.test(ua) && pathname.indexOf('/m') > -1) {
      nextApp.render(req, res, '/', query);
    } else {
      handle(req, res, parsedUrl);
    }
  });
};
