const path = require('path');

module.exports = {
  exclude: path.resolve(__dirname, '/views/styles/'),
  plugins: [
    require('autoprefixer')({
      /* ...options */
    }),
    require('postcss-px2rem-exclude')({
      remUnit: 37.5,
      baseDpr: 2,
      exclude: /views\/styles\/p/i,
    }),
  ],
};
