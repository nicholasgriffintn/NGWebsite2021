const ReturnImageFormattingUrl = (url) => {
  const baseUrl = {
    development: 'http://localhost:3000',
    production: 'https://nicholasgriffin.dev',
  }[process.env.NODE_ENV];

  if (url.includes('https://cdn.nicholasgriffin.dev/')) {
    let noCDNURL = url.replace('https://cdn.nicholasgriffin.dev/', '');

    return `${baseUrl}/api/resize/?image=${noCDNURL}`;
  }

  return url;
};

export default ReturnImageFormattingUrl;
