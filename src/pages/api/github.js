// import { withSentry } from '@sentry/nextjs';

const Gists = (req, res) => {
  return new Promise((resolve) => {
    fetch(
      `https://api.github.com/users/nicholasgriffintn/repos?sort=updated&type=public&per_page=${
        req.query.limit || '8'
      }&page=${req.query.offset || '1'}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Nicholas-Griffin-App',
        },
      }
    )
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

// export default withSentry(Gists);
export default Gists;
