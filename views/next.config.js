const webpack = require('webpack');
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const dev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  webpack: (config, {
    buildId, dev, isServer, defaultLoaders,
  }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __IS_SERVER__: isServer,
      }),
    );
    return config;
  },
};

module.exports = withPlugins(
  [
    withCSS,
    withSass,
    [
      withImages,
      {
        assetPrefix: dev ? '' : '//',
      },
    ],
  ],
  nextConfig,
);
