const withPWA = require('next-pwa');

const moduleExports = {
  reactStrictMode: true,
  pwa: {
    publicExcludes: ['!noprecache/**/*', '!playground/**/*'],
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  images: {
    domains: [
      'localhost',
      'nicholasgriffin.dev',
      'api.nicholasgriffin.dev',
      'cdn.nicholasgriffin.dev',
      'images.nicholasgriffin.dev',
      'media.giphy.com',
      'media0.giphy.com',
      'media1.giphy.com',
      'media2.giphy.com',
      'media3.giphy.com',
      'media4.giphy.com',
      'media5.giphy.com',
      'lastfm.freetls.fastly.net',
      'i.ibb.co',
      'via.placeholder.com',
    ],
  },
};

module.exports = withPWA(moduleExports);
