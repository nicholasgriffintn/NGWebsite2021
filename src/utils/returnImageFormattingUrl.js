const ReturnImageFormattingUrl = (url) => {
  const baseUrl = {
    development: 'https://images.nicholasgriffin.dev',
    production: 'https://images.nicholasgriffin.dev',
  }[process.env.NODE_ENV];

  if (url.includes('https://cdn.nicholasgriffin.dev/')) {
    let noCDNURL = url.replace('https://cdn.nicholasgriffin.dev/', '');

    return `${baseUrl}/resize/?image=${noCDNURL}`;
  }

  return url;
};

export default ReturnImageFormattingUrl;
