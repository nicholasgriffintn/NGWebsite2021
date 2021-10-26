// import { withSentry } from '@sentry/nextjs';

const Github = (req, res) => {
  return new Promise((resolve) => {
    fetch('https://api.github.com/users/nicholasgriffintn/gists', {
      method: 'GET',
      headers: {
        'User-Agent': 'Nicholas-Griffin-App',
      },
    })
      .then((json) => {
        return json.json();
      })
      .then((data) => {
        res.setHeader('Cache-Control', 'max-age=180000');
        res.json(data);
        res.status(200).end();
        return resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
        return resolve();
      });
  });
};

// export default withSentry(Github);
export default Github;
